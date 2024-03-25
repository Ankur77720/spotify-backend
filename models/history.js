const mongoose = require('mongoose');

// Define the schema for the history model
const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'track',
        required: true
    },
    repeat: {
        type: Number,
        default: 0
    }
}
    , {
        timestamps: true
    }
);

// Create the history model using the schema
const History = mongoose.model('history', historySchema);

// Export the history model
module.exports = History;