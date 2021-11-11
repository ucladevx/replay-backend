const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    name: String, //required
    artist: String, //required
    album: String,
    albumCover: String,
    concatKey: Number,
    timesPlayed: [Number],
    locationPlayed: [Number]
})

const Song = mongoose.model("Song", songSchema);
module.exports = Song;