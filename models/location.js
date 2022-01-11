const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number], // [latitude, longitude] in that order.
        required: true
    }
})

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;