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
    console.log(`Starting upload for file: ${fileName}`);
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
    console.error("❌ Error uploading file:", error.message || error);
    return null;
  }
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient){
    return new Promise((resolve,rejected)=>{
        const drive = google.drive({version:'v3',auth:authClient}); 

        var fileMetaData = {
            name:'mydrivetext.txt',    
            parents:['1peEN__NlGh0iGi6xkCwg8tU4kkUYoO03'] // A folder ID to which file will get uploaded
        }

        drive.files.create({
            resource:fileMetaData,
            media:{
                body: fs.createReadStream('mydrivetext.txt'), // files that will get uploaded
                mimeType:'text/plain'
            },
            fields:'id'
        },function(error,file){
            if(error){
                return rejected(error)
            }
            resolve(file);
        })
    });
}
