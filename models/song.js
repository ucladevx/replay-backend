const mongoose = require('mongoose');

// * just need songID and locationPlayed per offline discussion.
const songSchema = new mongoose.Schema({
    SpotifyTrackID: String, // required.
    locationPlayed: [String]
})

const Song = mongoose.model("Song", songSchema);
module.exports = Song;