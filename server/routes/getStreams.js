const express = require("express");
const { extractAllVoteData } = require("../controllers/getStreams");

const router = express.Router();

router.get("/get-streams", extractAllVoteData);

module.exports = router;
