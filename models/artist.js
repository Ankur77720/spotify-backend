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
        default: "https://firebasestorage.googleapis.com/v0/b/beat-stream.appspot.com/o/user.png?alt=media&token=928d9690-b6f3-47f9-a570-3a228a4eb767"
    },
    genres: {
        type: [ { type: String } ],
    },
}, {
    timestamps: true, // Include createdAt and updatedAt for record keeping
});


module.exports = mongoose.model('artist', artistSchema)