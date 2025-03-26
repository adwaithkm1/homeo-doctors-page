import fs from 'fs';
import { google } from 'googleapis';

const SCOPE = ['https://www.googleapis.com/auth/drive.file'];
const FOLDER_ID = process.env.FOLDER_ID; // Folder ID from environment variable

// Function to authenticate with Google Drive API
async function authorize(): Promise<any> {
    const jwtClient = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        undefined,
        process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure proper formatting
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
}

// Function to upload a file to Google Drive folder
async function uploadFile(authClient: any): Promise<void> {
    try {
        const drive = google.drive({ version: 'v3', auth: authClient });
        const filePath = 'mydrivetext.txt';
        fs.writeFileSync(filePath, 'This is a test file.');
        
        const fileMetadata = {
            name: 'mydrivetext.txt',
            parents: FOLDER_ID ? [FOLDER_ID] : []
        };

        const media = {
            mimeType: 'text/plain',
            body: fs.createReadStream(filePath)
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id'
        });
        
        console.log(`✅ File uploaded successfully. File ID: ${response.data.id}`);
    } catch (error: any) {
        console.error('❌ Error uploading file:', error.message || error);
    }
}

// Execute the script
authorize().then(uploadFile).catch(console.error);
