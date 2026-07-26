import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    // เพิ่มขีดจำกัดเพื่อไม่ให้แจ้งเตือน Warning รบกวน
    chunkSizeWarningLimit: 1000,
    
    // แยกไฟล์ node_modules ออกมาเป็นไฟล์แยก (ทำให้ไฟล์หลักเล็กลง)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});