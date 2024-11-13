const express = require("express");
const { submitVote, extractVoteData, hasUserVoted, getUserVoteDetails } = require("../controllers/vote");

const router = express.Router();

router.post("/vote", submitVote);
router.get("/get-vote-data", extractVoteData);
router.get("/vote-status", hasUserVoted);
router.get("/voted-details", getUserVoteDetails);

module.exports = router;
