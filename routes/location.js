const express = require("express");
const router = express.Router();

const { update } = require("../helpers/location");

router.post("/update", update);

module.exports = router;