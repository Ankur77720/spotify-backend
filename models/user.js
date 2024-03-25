const mongoose = require('mongoose');
const validator = require('validator');
const plm = require('passport-local-mongoose')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        },
    },
    accessLevel: {
        type: Number,
        default: 1
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    profilePicture: {
        type: String,
    },
    likedTracks: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'track',
    },
    playlists: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'playlist',
    },
    country: {
        type: String,
    },
    subscriptionTier: { // Free, Premium, etc.
        type: String,
    },
    devices: [ {
        type: String
    } ],
},
    {
        timestamps: true, // Include createdAt and updatedAt for record keeping
    }
)



userSchema.plugin(plm)


module.exports = mongoose.model('user', userSchema)