const express = require("express");
const { createEvent, getCandidates, getActiveEvents, getActiveEventsById, getInactiveEvents, getCompletedEvents, getCompletedEventsById, editEvent, deleteEvent, getTotalCompletedEvents } = require("../controllers/events");

const router = express.Router();

router.post("/create-event", createEvent);
router.get("/get-candidates", getCandidates);
router.get("/get-events", getActiveEvents);
router.get("/get-events/:eventId", getActiveEventsById);
router.get("/get-events-inactive", getInactiveEvents);
router.get("/get-events-completed", getCompletedEvents);
router.get("/get-events-completed/:eventId", getCompletedEventsById);
router.put("/edit-event/:id", editEvent);
router.delete("/delete-event/:id", deleteEvent);
router.get("/get-completed-events-total", getTotalCompletedEvents);

module.exports = router;
