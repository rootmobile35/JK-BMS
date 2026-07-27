// Vite auto-increments its port (5174, 5175, ...) whenever an earlier dev
// server is still holding 5173 - a hardcoded single CLIENT_ORIGIN silently
// blocks every request from that origin the moment this happens, including
// the Socket.IO handshake (which has its own separate CORS check from the
// plain HTTP one). This is a local single-user dev tool, never exposed
// publicly, so allowing any localhost/127.0.0.1 origin removes that whole
// class of failure instead of chasing whatever port Vite happened to land
// on. Shared by index.js (HTTP) and realtime.js (Socket.IO) so both always
// agree - this bug already recurred once from the two being defined separately.
const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const ALLOWED_ORIGINS = [
  "http://localhost:5173",  // สำหรับรันในเครื่องคอมตัวเอง
  "http://127.0.0.1:5173",
  // ⚡ เพิ่ม URL หน้าเว็บจริงของคุณบน Azure เข้าไปตรงนี้ครับ:
  "https://gray-river-062e4cd00.7.azurestaticapps.net" 
];

 
export function isAllowedOrigin(origin) {
  return !origin || LOCALHOST_ORIGIN.test(origin) || origin === process.env.CLIENT_ORIGIN;
}
