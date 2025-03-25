import { google } from "googleapis";
import { JWT } from "google-auth-library";
import * as fs from "fs";

// Read the service account credentials from environment variables
const serviceAccountInfo = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}');

// Authenticate using service account credentials
const auth = new JWT({
  email: serviceAccountInfo.client_email,
  key: serviceAccountInfo.private_key,
  scopes: ["https://www.googleapis.com/auth/drive.file"]
});

// Initialize the Drive API client
const drive = google.drive({ version: "v3", auth });

// Function to upload a file to Google Drive
async function uploadFile(filePath: string, fileName: string) {
  try {
    const media = fs.createReadStream(filePath);
    const fileMetadata = {
      name: fileName,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        body: media,
      },
      fields: "id",
    });

    console.log(`File uploaded successfully with ID: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
  }
}

// Function to share a file on Google Drive
async function shareFile(fileId: string, userEmail: string) {
  try {
    const permission = {
      type: "user",
      role: "reader",  // Set as "reader" for read-only access
      emailAddress: userEmail,
    };

    await drive.permissions.create({
      fileId,
      requestBody: permission,
    });

    console.log(`File shared successfully with ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sharing file:", error);
  }
}

// Create and upload a simple "hi.txt" file
const filePath = "hi.txt";
fs.writeFileSync(filePath, "hi");

// Upload the file
uploadFile(filePath, "hi.txt").then((fileId) => {
  if (fileId) {
    // Share the file with the specified email
    shareFile(fileId, "georgianhomoeomedicalcenter@gmail.com");
  }
});
