const express = require("express");
const { createEvent } = require("../controllers/events");

const router = express.Router();

router.post("/create-event", createEvent);

module.exports = router;
