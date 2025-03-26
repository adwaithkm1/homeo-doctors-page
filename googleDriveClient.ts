const fs = require('fs');
const { google } = require('googleapis');

const SCOPE = ['https://www.googleapis.com/auth/drive.file'];
const FOLDER_ID = process.env.FOLDER_ID; // Folder ID from environment variable

// A Function that can provide access to Google Drive API
async function authorize() {
    const jwtClient = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        null,
        process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure proper formatting
        SCOPE
    );

    await jwtClient.authorize();
    return jwtClient;
}

// A Function that will upload the desired file to Google Drive folder
async function uploadFile(authClient) {
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
    } catch (error) {
        console.error('❌ Error uploading file:', error.message || error);
    }
}

authorize().then(uploadFile).catch(console.error);
