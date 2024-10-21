const express = require("express");
const { submitVote, extractVoteData } = require("../controllers/vote");

const router = express.Router();

router.post("/vote", submitVote);
router.get("/get-vote-data", extractVoteData);

module.exports = router;
