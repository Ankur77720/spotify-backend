const firebaseAdmin = require('../firebase-config')
const { Readable } = require('stream')

module.exports.index = function (req, res, next) {
    console.log(req.user)
    res.status(200).json({ message: "spotify" })
}


module.exports.upload = async (req, res) => {
    try {
        // Get uploaded file info
        const file = req.file;

        // Create a reference to the file in Cloud Storage
        const bucket = firebaseAdmin.storage().bucket();
        const fileRef = bucket.file(file.originalname);

        // Create a buffer stream from the uploaded file
        const bufferStream = Readable.from(file.buffer);
        const writeStream = fileRef.createWriteStream()

        // Upload the file to Cloud Storage using the buffer stream
        bufferStream.pipe(writeStream)

        writeStream.on('finish', async () => {
            await fileRef.makePublic();

            res.json({ message: 'File uploaded successfully!', url: fileRef.publicUrl() });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file!' });
    }
};