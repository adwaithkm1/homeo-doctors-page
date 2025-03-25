import express from "express";
import { saveDataToDrive, fetchBackupData } from "../lib/googleDriveStorage";

const router = express.Router();

/**
 * ✅ Save appointment data to Google Drive
 */
router.post("/save", async (req, res) => {
  try {
    const appointment = req.body;
    await saveDataToDrive(appointment);
    res.status(200).json({ message: "✅ Data saved to Google Drive!" });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

/**
 * ✅ Fetch appointment data from Google Drive
 */
router.get("/fetch", async (req, res) => {
  try {
    const data = await fetchBackupData();
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;
