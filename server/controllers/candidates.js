const Candidate = require('../models/candidates'); // Update the path as necessary

// Create a new candidate
exports.createCandidate = async (req, res) => {
    try {
        const candidate = new Candidate(req.body);
        await candidate.save();
        res.status(201).json(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all candidates
exports.getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('parties');
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single candidate by ID
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate('parties');
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a candidate by ID
exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.status(200).json(candidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a candidate by ID
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
