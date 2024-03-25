const firebaseAdmin = require('../firebase-config')
const { Readable } = require('stream')
const id3 = require('node-id3')
const trackModel = require('../models/track')
const artistModel = require('../models/artist')
const crypto = require('crypto')


module.exports.index = function (req, res, next) {
    console.log(req.cookies)
    res.status(200).json({ message: "spotify" })
}


module.exports.upload = async (req, res) => {
    try {
        const files = req.files; // Assuming req.files contains an array of uploaded files
        const uploads = [];

        for (const file of files) {
            const fileState = id3.read(file.buffer);

            const artist = fileState.artist ? fileState.artist.split('/') : [];

            const artists = await Promise.all(artist.map(async (artistName) => {
                let artist = await artistModel.findOne({ name: artistName.toLowerCase() });

                if (!artist) {
                    artist = await artistModel.create({ name: artistName.toLowerCase() });
                }
                return artist._id;
            }));

            uploads.push({
                title: fileState.title,
                artists,
                album: fileState.album,
                year: fileState.year,
                file,
                fileState
            });
        }

        const bucket = firebaseAdmin.storage().bucket();
        const uploadPromises = [];

        for (const upload of uploads) {
            const fileRefAudio = bucket.file(upload.file.originalname);
            const bufferStream = Readable.from(upload.file.buffer);
            const writeStreamAudio = fileRefAudio.createWriteStream();

            const audioUploadPromise = new Promise((resolve, reject) => {
                bufferStream.pipe(writeStreamAudio);
                writeStreamAudio.on('finish', async () => {
                    await fileRefAudio.makePublic();
                    const AudioUrls = fileRefAudio.publicUrl();
                    resolve(AudioUrls);
                });
                writeStreamAudio.on('error', reject);
            });

            const fileRafPoster = bucket.file(crypto.randomBytes(43).toString("hex") + "." + upload.fileState.image.mime.split('/')[ 1 ]);
            const posterFileStream = Readable.from(upload.fileState.image.imageBuffer);
            const posterWritStream = fileRafPoster.createWriteStream();

            const posterUploadPromise = new Promise((resolve, reject) => {
                posterFileStream.pipe(posterWritStream);
                posterWritStream.on('finish', async () => {
                    await fileRafPoster.makePublic();
                    const PosterUrls = fileRafPoster.publicUrl();
                    resolve(PosterUrls);
                });
                posterWritStream.on('error', reject);
            });

            uploadPromises.push(Promise.all([ audioUploadPromise, posterUploadPromise, upload ]));
        }

        const results = await Promise.all(uploadPromises);

        const tracks = [];

        for (const [ audioUrl, posterUrl, upload ] of results) {
            const newTrack = await trackModel.create({
                title: upload.title,
                artists: upload.artists,
                album: upload.album,
                year: upload.year,
                poster: posterUrl,
                url: audioUrl,
            });
            tracks.push(newTrack);
        }

        res.json({ message: 'Files uploaded successfully!', tracks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading files!' });
    }
};


module.exports.createHistory = async (req, res) => {
    try {
        const trackId = req.body.trackId;
        const userId = req.user._id;

        if (!trackId) {
            return res.status(400).json({ message: 'Track ID is required!' });
        }


        let history = await historyModel.findOne({
            userId,
            trackId,
        });

        if (history) {
            // If the history document exists, update the 'looped' field
            history.looped = history.looped + 1;
            await history.save();
        } else {
            // If the history document doesn't exist, create a new one
            history = await historyModel.create({
                userId,
                trackId,
                looped: 1,
            });
        }

        res.json({ message: 'History updated successfully!', history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating history!' });
    }
};





module.exports.getRandomTracks = async (req, res) => {
    try {
        let tracks = await trackModel.aggregate([
            { $sample: { size: 20 } }, // Sample 20 documents
            {
                $lookup: {
                    from: "artists", // Assuming the collection name for artists is "artists"
                    localField: "artists",
                    foreignField: "_id",
                    as: "artistDetails"
                }
            },
            {
                $addFields: {
                    artists: "$artistDetails" // Replace the artists array with the fetched artist details
                }
            },
            { $unset: "artistDetails" } // Remove the temporary field created for artist details
        ]);

        res.json({ message: 'Random tracks retrieved successfully!', tracks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving random tracks!' });
    }
};
