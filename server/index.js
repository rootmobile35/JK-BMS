import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { migrate } from "./db.js";
import authRoutes from "./routes/auth.js";
import hubsRoutes from "./routes/hubs.js";
import adminRoutes from "./routes/admin.js";
import historyRoutes from "./routes/history.js";
import { createAnnouncementsRouter } from "./routes/announcements.js";
import { attachRealtime } from "./realtime.js";
import { startTelemetryLogger } from "./telemetryLogger.js";
import { isAllowedOrigin } from "./corsOrigin.js";

migrate();
startTelemetryLogger();

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/hubs", hubsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/hubs", historyRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const httpServer = createServer(app);
const io = attachRealtime(httpServer);
app.use("/api/announcements", createAnnouncementsRouter(io));

const port = process.env.PORT || 4000;
httpServer.listen(port, () => {
  console.log(`BMS backend listening on http://localhost:${port}`);
});
