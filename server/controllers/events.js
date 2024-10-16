const Event = require("../models/events");
const Candidate = require("../models/candidates");

async function createEvent(req, res) {
  const { name, candidateIds } = req.body;
  console.log(req.body);
  try {
    const event = new Event({
      eventName: name,
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

async function getEvents(req, res) {
  try {
    const events = await Event.find().populate({
      path: "candidates",
      populate: {
        path: "party",
        select: "name"
      }
    });

    const eventsWithCandidateDetails = events.map(event => {
      return {
        ...event.toObject(),
        candidates: event.candidates.map(candidate => {
          return {
            ...candidate.toObject(),
            image: `http://localhost:8080/uploads/candidates/${candidate.image.split('\\').pop()}`,
            partyName: candidate.party ? candidate.party.name : null
          };
        })
      };
    });
    res.status(200).json(eventsWithCandidateDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching events" });
  }
}

async function editEvent(req, res) {
  try {
    const eventId = req.params.id;
    const { name, candidateIds } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { eventName: name, candidates: candidateIds },
      { new: true }
    );

    if (updatedEvent) {
      res.status(200).json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
}

async function deleteEvent(req, res) {
  try {
    const eventId = req.params.id;
    const result = await Event.findByIdAndDelete(eventId);
    if (result) {
      res.status(200).json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
}

module.exports = { createEvent, getCandidates, getEvents, editEvent, deleteEvent };
