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
  scopes: ["https://www.googleapis.com/auth/drive.file"], // Scope for Drive file access
});

const drive = google.drive({ version: "v3", auth });

// Example to list files with improved error handling
async function listFiles() {
  try {
    const res = await drive.files.list({
      pageSize: 10,
      fields: "files(id, name)",
    });
    console.log("Files:", res.data.files);
  } catch (error) {
    console.error("❌ Error fetching files from Google Drive:", error);
  }
}

listFiles(); // Call the function
