const express = require("express");
const router = express.Router();

const { update } = require("../helpers/location");

router.post("/update", update);

router.get("/nearby", nearby);

module.exports = router;