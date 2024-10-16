const express = require("express");
const { createEvent, getCandidates, getEvents, editEvent, deleteEvent } = require("../controllers/events");

const router = express.Router();

router.post("/create-event", createEvent);
router.get("/get-candidates", getCandidates);
router.get("/get-events", getEvents);
router.put("/edit-event/:id", editEvent);
router.delete("/delete-event/:id", deleteEvent);

module.exports = router;
