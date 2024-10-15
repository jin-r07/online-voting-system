const express = require("express");
const { createEvent, getCandidates } = require("../controllers/events");

const router = express.Router();

router.post("/create-event", createEvent);
router.get("/get-candidates", getCandidates);

module.exports = router;
