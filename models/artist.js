const mongoose = require('mongoose')

const artistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Case-insensitive unique constraint for artist names
        lowercase: true, // Enforce lowercase for name storage
    },
    // Additional properties for future scalability:
    bio: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    genres: {
        type: [ { type: String } ],
    },
}, {
    timestamps: true, // Include createdAt and updatedAt for record keeping
});


module.exports = mongoose.model('artist', artistSchema)