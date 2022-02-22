const mongoose = require('mongoose');
const { locationSchema } = require('../models/location')

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true }, // required.
    email: { type: String, unique: true }, // required.
    password: String, // required.
    sharePlaybackPostQuit: Boolean,
    currentLocation: locationSchema,
    songsPlayed: [String], // store vs pull from api?
    topArtists: [String], // store vs pull from api?
    promptAnswers: [],
    dp: String
})

const User = mongoose.model("User", userSchema);
module.exports = User;