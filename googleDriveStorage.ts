import { drive } from "./googleDriveClient";
import fs from "fs";
import path from "path";
import { Appointment } from "@shared/schema";

const DRIVE_FOLDER_ID = "1D_s20e_oLAoZKTXtqcY1bcJ7xF0Gnu51"; // 📌 Replace with your Google Drive Folder ID

const FILE_NAME = "appointment_backup.json";
const filePath = path.join(process.cwd(), FILE_NAME);

/**
 * ✅ Save appointment data to Google Drive
 */
export async function saveDataToDrive(newData: Appointment) {
  try {
    // ✅ Fetch existing file (if any)
    const { data } = await drive.files.list({
      q: name='${FILE_NAME}' and '${DRIVE_FOLDER_ID}' in parents,
      fields: "files(id, name)",
    });

    let existingData: Appointment[] = [];
    let fileId = null;

    if (data.files.length > 0) {
      fileId = data.files[0].id;

      // ✅ Download existing file content
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

    // ✅ Save updated data to a temporary file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    // ✅ Upload to Google Drive (replace existing file if found)
    const media = { mimeType: "application/json", body: fs.createReadStream(filePath) };
    if (fileId) {
      await drive.files.update({ fileId, media });
    } else {
      await drive.files.create({
        media,
        requestBody: { name: FILE_NAME, parents: [DRIVE_FOLDER_ID] },
      });
    }

    console.log("✅ Data saved to Google Drive!");
  } catch (error) {
    console.error("Google Drive Save Error:", error);
  }
}

/**
 * ✅ Fetch appointments data from Google Drive
 */
export async function fetchBackupData(): Promise<Appointment[]> {
  try {
    const { data } = await drive.files.list({
      q: name='${FILE_NAME}' and '${DRIVE_FOLDER_ID}' in parents,
      fields: "files(id, name)",
    });

    if (data.files.length === 0) return [];

    const fileId = data.files[0].id;
    const file = await drive.files.get({ fileId, alt: "media" });

    return JSON.parse(file.data);
  } catch (error) {
    console.error("Google Drive Fetch Error:", error);
    return [];
  }
}
