const express = require("express");
const { getVoteLogs } = require("../controllers/log");

const router = express.Router();

router.get("/get-allVote-logs", getVoteLogs);

module.exports = router;
