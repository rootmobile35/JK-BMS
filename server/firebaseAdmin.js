import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.resolve(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json");

// 1. ตรวจสอบว่ามีคีย์แอบฝังอยู่ในรูปแบบข้อความ JSON (สำหรับใช้งานบน Azure) หรือไม่
const hasJsonConfig = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
// 2. ตรวจสอบว่ามีไฟล์คีย์จริงๆ อยู่ในเครื่องคอมพิวเตอร์ของคุณหรือไม่
const hasFileConfig = fs.existsSync(keyPath);

// ระบบถือว่าเชื่อมต่อได้ ถ้ามีค่าแบบใดแบบหนึ่ง
export const isFirebaseConfigured = hasJsonConfig || hasFileConfig;

if (!isFirebaseConfigured) {
  console.warn(
    `\nFirebase service account key not found at ${keyPath} and FIREBASE_SERVICE_ACCOUNT_JSON is missing.\n` +
      "Login will work, but Hub/ESP32 data won't load until you add it:\n" +
      "Firebase Console > Project Settings > Service Accounts > Generate new private key,\n" +
      "save the downloaded JSON there (or point FIREBASE_SERVICE_ACCOUNT_PATH at it in server/.env).\n"
  );
}

// ฟังก์ชันสำหรับเตรียมการดึงสิทธิ์ (Credential) ไปคุยกับ Firebase
const getCredential = () => {
  if (hasJsonConfig) {
    // ดึงค่าจากข้อความ JSON บน Azure มาใช้งานโดยตรงโดยไม่ต้องอ่านไฟล์ดิสก์
    return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }
  if (hasFileConfig) {
    // ดึงจากไฟล์ในเครื่องคอมพิวเตอร์ของคุณตามปกติ
    return cert(JSON.parse(fs.readFileSync(keyPath, "utf8")));
  }
  return null;
};

export const adminDb = isFirebaseConfigured
  ? getDatabase(
      initializeApp({
        credential: getCredential(),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      })
    )
  : null;
