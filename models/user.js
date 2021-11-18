const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true }, // required.
    email: { type: String, unique: true }, // required.
    password: String, // required.
    spotifyUsername: String,
    // spotifyPassword: String,
    currentLocation: String, // locationSchema id.
    songsPlayed: [String], // spotify track id's.
    topArtists: [String], // names / spotify id's?
    promptAnswers: [],
    dp: String
})

const User = mongoose.model("User", userSchema);
module.exports = User;