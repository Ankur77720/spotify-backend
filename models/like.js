const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    track: {
        type: mongoose.Types.ObjectId,
        ref: 'track'
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('like', likeSchema)
