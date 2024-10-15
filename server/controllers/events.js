const Event = require("../models/events");
const Candidate = require("../models/candidates");

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
}

async function getCandidates(req, res) {
  try {
    const candidates = await Candidate.find().populate("party", "name");
    const candidatesWithImageURLs = candidates.map(candidate => {
      return {
          ...candidate.toObject(),
          image: `http://localhost:8080/uploads/candidates/${candidate.image.split('\\').pop()}`,
          partyName: candidate.party ? candidate.party.name : null
      };
  });
    res.status(200).json(candidatesWithImageURLs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching candidates" });
  }
}

async function getEvents (req, res) {
  try {
    const events = await Event.find().populate("candidateIds");
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching events" });
  }
};

module.exports = { createEvent, getCandidates, getEvents };
