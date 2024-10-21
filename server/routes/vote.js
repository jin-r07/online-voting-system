const express = require("express");
const { submitVote, extractVoteData, hasUserVoted } = require("../controllers/vote");

const router = express.Router();

router.post("/vote", submitVote);
router.get("/get-vote-data", extractVoteData);
router.get("/vote-status", hasUserVoted);

module.exports = router;
