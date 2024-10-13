const Candidate = require("../models/candidates");
const Party = require("../models/parties");

async function createCandidate(req, res) {
    const { name, partyId } = req.body;
    const image = req.file.path;

    try {
        const party = await Party.findById(partyId);
        if (!party) {
            return res.status(404).json({ error: "Party not found" });
        }

        const newCandidate = new Candidate({ name, image, party: partyId });
        await newCandidate.save();
        res.status(201).json(newCandidate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating candidate" });
    }
}

async function getAllCandidates(req, res) {
    try {
        const candidates = await Candidate.find().populate('party', 'name');
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

async function editCandidate(req, res) {
    const { id } = req.params;
    const { name, partyId } = req.body;
    let image;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        if (req.file) {
            image = req.file.path;
        } else {
            image = candidate.image;
        }

        candidate.name = name;
        candidate.party = partyId;
        candidate.image = image;

        await candidate.save();
        res.status(200).json(candidate);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating candidate" });
    }
}

async function deleteCandidate(req, res) {
    const { id } = req.params;

    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(id);
        if (!deletedCandidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting candidate" });
    }
}

module.exports = { createCandidate, getAllCandidates, editCandidate, deleteCandidate };
