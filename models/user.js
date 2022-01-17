const mongoose = require('mongoose');
const { locationSchema } = require('../models/location')

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true }, // required.
    email: { type: String, unique: true }, // required.
    password: String, // required.
    spotifyUsername: String,
    // spotifyPassword: String,
    currentSong: String, // track id for current or most recently played song. this is what's displayed.
    currentLocation: locationSchema,
    songsPlayed: [String], // spotify track id's, sorted by most-recent first.
    topArtists: [String], // names / spotify id's?
    promptAnswers: [], // TODO.
    dp: String
})

const User = mongoose.model("User", userSchema);
module.exports = User;