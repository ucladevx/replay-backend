const express = require("express");
const router = express.Router();

// include jwt middleware

const { recentlyPlayed, topArtistsOrTracks } = require("../helpers/spotify");

router.get("/recentlyPlayed", recentlyPlayed);
router.get("/top", topArtistsOrTracks);

module.exports = router;
