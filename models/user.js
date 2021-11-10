const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String, // required.
    password: String, // required.
    spotifyUsername: String,
    spotifyPassword: String,
    currentLocation: String, // locationSchema id.
    songsPlayed: [String], // id's of Song objects.
    topArtists: [String], // names?
    promptAnswers: [],
    dp: String
})

const User = mongoose.model("User", userSchema);
module.exports = User;