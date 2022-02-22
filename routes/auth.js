const express = require("express");
const router = express.Router();

// set up middleware to ensure endpoints are only accessed by authenticated users.
// const jwtCheck = require("../helpers/jwtCheck");

const { signUp, signIn, spotify, callback, refreshToken } = require("../helpers/auth");

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/spotify", spotify);
router.get("/callback", callback);
router.get("/refreshToken", refreshToken);

module.exports = router;
