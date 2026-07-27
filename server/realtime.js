import { Server } from "socket.io";
import { parse as parseCookie } from "cookie";
import { COOKIE_NAME, verifySession } from "./auth.js";
import { allowedHubIds } from "./hubAccess.js";
import { adminDb, isFirebaseConfigured } from "./firebaseAdmin.js";
import { readPath } from "./firebaseRead.js";
import { isAllowedOrigin } from "./corsOrigin.js";

const REST_POLL_MS = 5000;

export function attachRealtime(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    },
    // 🚀 เพิ่มบรรทัดนี้เพื่อบังคับให้รองรับทั้ง WebSocket และ Polling แบบจัดสรรสิทธิ์ล่วงหน้าบนระบบคลาวด์
    transports: ["websocket", "polling"] 
  });

  io.use((socket, next) => {
    const cookies = parseCookie(socket.request.headers.cookie || "");
    const payload = verifySession(cookies[COOKIE_NAME]);
    if (!payload) return next(new Error("unauthorized"));
    socket.user = payload;
    next();
  });

  io.on("connection", (socket) => {
    const allowed = allowedHubIds(socket.user);
    const cleanup = [];

    if (socket.user.role === "user") socket.join("role:user");

    if (isFirebaseConfigured) {
      if (allowed === null) {
        const ref = adminDb.ref("JK_BMS_HUB");
        const cb = (snap) => socket.emit("hubs:all", snap.val() ?? {});
        ref.on("value", cb);
        cleanup.push(() => ref.off("value", cb));
      } else {
        socket.emit("hubs:list", allowed);
        for (const hubId of allowed) {
          const ref = adminDb.ref(`JK_BMS_HUB/${hubId}`);
          const cb = (snap) => socket.emit("hub:update", { hubId, data: snap.val() });
          ref.on("value", cb);
          cleanup.push(() => ref.off("value", cb));
        }
      }
    } else {
      if (allowed === null) {
        const tick = async () => socket.emit("hubs:all", (await readPath("JK_BMS_HUB")) ?? {});
        tick();
        const id = setInterval(tick, REST_POLL_MS);
        cleanup.push(() => clearInterval(id));
      } else {
        socket.emit("hubs:list", allowed);
        const id = setInterval(async () => {
          for (const hubId of allowed) {
            socket.emit("hub:update", { hubId, data: await readPath(`JK_BMS_HUB/${hubId}`) });
          }
        }, REST_POLL_MS);
        for (const hubId of allowed) {
          readPath(`JK_BMS_HUB/${hubId}`).then((data) => socket.emit("hub:update", { hubId, data }));
        }
        cleanup.push(() => clearInterval(id));
      }
    }

    socket.on("disconnect", () => {
      for (const fn of cleanup) fn();
    });
  });

  return io;
}
