const express = require("express");
const { submitVote } = require("../controllers/vote");

const router = express.Router();

router.post("/vote", submitVote);

module.exports = router;
