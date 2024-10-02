const functions = require('firebase-functions/v1');
const { google } = require('googleapis');
const path = require('path');

exports.listFiles = functions.https.onRequest(async (req, res) => {
    try {
        // Authenticate using GoogleAuth
        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, 'credentials.json'), // Ensure the correct path
            scopes: ['https://www.googleapis.com/auth/drive'],
        });

        // Initialize Google Drive API
        const drive = google.drive({ version: 'v3', auth });

        // Example: Listing files in Google Drive
        const response = await drive.files.list({
            pageSize: 10,
            fields: 'files(id, name)',
        });

        // Send the result back to the client
        res.status(200).send(response.data.files);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error in Google Drive API');
    }
});

exports.createFile = functions.https.onRequest(async (req, res) => {
    // Authenticate using GoogleAuth
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, 'credentials.json'), // Ensure the correct path
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Initialize Google Drive API
    const drive = google.drive({ version: 'v3', auth });

    const driveFile = await drive.files.create({
        requestBody: {
            name: 'testfile.txt',
            mimeType: 'text/plain',
            supportsAllDrives: true
        },
        media: {
            mimeType: 'text/plain',
            body: "some random string"
        }
    });

    res.json({ fileId: driveFile.data.id });
})

exports.deleteFile = functions.https.onRequest(async (req, res) => {
    const fileId = req.query['fileId']
    if (!fileId) {
        return res.send("Missing 'fileId' query")
    }
    // Authenticate using GoogleAuth
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, 'credentials.json'), // Ensure the correct path
        scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Initialize Google Drive API
    const drive = google.drive({ version: 'v3', auth });

    try {
        await drive.files.delete({
            fileId: fileId
        });
        res.send(`file "${fileId}" deleted`);
    } catch (error) {
        res.send(`${error.message}`);
    }

})