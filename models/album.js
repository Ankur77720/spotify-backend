const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artist',
        required: true,
    },
    year: {
        type: Number,
    },
    genre: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    tracks: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'track',
    },
}, {
    timestamps: true, // Include createdAt and updatedAt for record keeping
})