const mongoose = require('mongoose');


const trackSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artists: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'artist',
        required: true,
    } ],
    album: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
    },
    genre: {
        type: String,
    },
    tags: [ {
        type: String,
        lowercase: true,
    } ],
    explicit: { // Flag for explicit content
        type: Boolean,
        default: false,
    },
    poster: {
        type: String,
    },
    url: { // Path to the actual MP3 file storage
        type: String,
        required: true,
    },
    plays: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true, // Include createdAt and updatedAt for record keeping
    }
)

trackSchema.index({ title: 'text' });


module.exports = mongoose.model('track', trackSchema)