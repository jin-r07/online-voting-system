const express = require("express");
const { createEvent, getCandidates, getEvents } = require("../controllers/events");

const router = express.Router();

router.post("/create-event", createEvent);
router.get("/get-candidates", getCandidates);
router.get("/get-events", getEvents);

module.exports = router;
