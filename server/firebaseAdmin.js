import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.resolve(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json");

// Missing the key does NOT crash the whole server - login/session/auth
// routes don't touch Firebase at all, so they must keep working while the
// key is still being set up. Only routes/hubs.js, routes/admin.js, and
// realtime.js actually need `adminDb`; each checks isFirebaseConfigured
// and responds with a clear "not configured yet" error instead of crashing.
export const isFirebaseConfigured = fs.existsSync(keyPath);

if (!isFirebaseConfigured) {
  console.warn(
    `\nFirebase service account key not found at ${keyPath}\n` +
      "Login will work, but Hub/ESP32 data won't load until you add it:\n" +
      "Firebase Console > Project Settings > Service Accounts > Generate new private key,\n" +
      "save the downloaded JSON there (or point FIREBASE_SERVICE_ACCOUNT_PATH at it in server/.env).\n"
  );
}

export const adminDb = isFirebaseConfigured
  ? getDatabase(
      initializeApp({
        credential: cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      })
    )
  : null;
