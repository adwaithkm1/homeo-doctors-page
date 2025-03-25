import { drive } from "../config/googleDriveClient"; // Ensure this exists!
import { Appointment } from "@shared/schema";

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID; // ✅ Use environment variable
const FILE_NAME = "appointment_backup.json";

/**
 * ✅ Save appointment data to Google Drive
 */
export async function saveDataToDrive(newData: Appointment) {
  try {
    if (!DRIVE_FOLDER_ID) throw new Error("Google Drive Folder ID is missing!");

    // ✅ Fetch existing file (if any)
    const { data } = await drive.files.list({
      q: `name='${FILE_NAME}' and '${DRIVE_FOLDER_ID}' in parents`,
      fields: "files(id, name)",
    });

    let existingData: Appointment[] = [];
    let fileId = data.files.length > 0 ? data.files[0].id : null;

    // ✅ Download existing file content if found
    if (fileId) {
      const file = await drive.files.get({ fileId, alt: "media" });
      existingData = JSON.parse(file.data);
    }

    // ✅ Add or update appointment
    const index = existingData.findIndex((item) => item.id === newData.id);
    if (index >= 0) {
      existingData[index] = { ...newData, updatedAt: new Date().toISOString() };
    } else {
      existingData.push({ ...newData, updatedAt: new Date().toISOString() });
    }

    // ✅ Upload updated JSON data directly to Google Drive
    const media = { mimeType: "application/json", body: JSON.stringify(existingData, null, 2) };

    if (fileId) {
      await drive.files.update({
        fileId,
        media,
        requestBody: { name: FILE_NAME, parents: [DRIVE_FOLDER_ID] },
      });
    } else {
      await drive.files.create({
        media,
        requestBody: { name: FILE_NAME, parents: [DRIVE_FOLDER_ID] },
      });
    }

    console.log("✅ Data successfully saved to Google Drive!");
  } catch (error) {
    console.error("❌ Google Drive Save Error:", error);
  }
}

/**
 * ✅ Fetch appointments data from Google Drive
 */
export async function fetchBackupData(): Promise<Appointment[]> {
  try {
    if (!DRIVE_FOLDER_ID) throw new Error("Google Drive Folder ID is missing!");

    const { data } = await drive.files.list({
      q: `name='${FILE_NAME}' and '${DRIVE_FOLDER_ID}' in parents`,
      fields: "files(id, name)",
    });

    if (data.files.length === 0) return [];

    const fileId = data.files[0].id;
    const file = await drive.files.get({ fileId, alt: "media" });

    return JSON.parse(file.data);
  } catch (error) {
    console.error("❌ Google Drive Fetch Error:", error);
    return [];
  }
}
