const mongoose = require('mongoose')

// * List the longitude first and then latitude.

// * Valid longitude values are between -180 and 180, both inclusive.
// * Valid latitude values are between -90 and 90, both inclusive.

// * Each degree of latitude is approximately 69 miles apart.
// * The distance between longitudes varies greatly (69 miles at the quarter, 0 miles at the pole).
const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude] in that order.
        required: true
    }
})

const Location = mongoose.model("Location", locationSchema);

module.exports = { Location, locationSchema };