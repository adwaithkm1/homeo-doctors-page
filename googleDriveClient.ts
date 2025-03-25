import { google } from "googleapis";

// ✅ Read service account credentials from an environment variable
let serviceAccount: Record<string, any> | null = null;

try {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT is not set in environment variables.");
  }
  serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
} catch (error) {
  console.error("❌ Error parsing GOOGLE_SERVICE_ACCOUNT:", error);
}

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount || undefined, // ✅ Use credentials from env, fallback to default credentials
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export { drive };
