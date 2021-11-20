const express = require("express");
const router = express.Router();

const { nearby } = require("../helpers/location");

router.get("/nearby", nearby);

// TODO: for Nathan.
// router.post("/update", signIn); 

module.exports = router;