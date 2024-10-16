const express = require("express");
const { createEvent, getCandidates, getActiveEvents, getInactiveEvents, getCompletedEvents, editEvent, deleteEvent } = require("../controllers/events");

const router = express.Router();

router.post("/create-event", createEvent);
router.get("/get-candidates", getCandidates);
router.get("/get-events", getActiveEvents);
router.get("/get-events-inactive", getInactiveEvents);
router.get("/get-events-completed", getCompletedEvents);
router.put("/edit-event/:id", editEvent);
router.delete("/delete-event/:id", deleteEvent);

module.exports = router;
