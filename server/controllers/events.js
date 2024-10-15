const Event = require("../models/events");

async function createEvent(req, res) {
  const { name, candidateIds } = req.body;

  try {
    const event = new Event({
      name,
      candidates: candidateIds,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating event" });
  }
};

module.exports = { createEvent };
