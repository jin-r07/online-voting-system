const Candidate = require("../models/candidates");

// Create a new candidate
const createCandidate = async (req, res) => {
    const { name, parties } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const newCandidate = new Candidate({ name, image, parties });
        await newCandidate.save();
        res.status(201).json(newCandidate);
    } catch (error) {
        res.status(400).json({ message: 'Error creating candidate', error: error.message });
    }
};

// Get all candidates
const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().populate('parties');
        if (candidates.length === 0) {
            return res.status(404).json({ message: 'No candidates found' });
        }
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching candidates', error: error.message });
    }
};

// Get a candidate by ID
const getCandidateById = async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id).populate('parties');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching candidate', error: error.message });
    }
};

// Update a candidate by ID
const updateCandidate = async (req, res) => {
    const { id } = req.params;
    const { name, parties } = req.body;
    let image;

    if (req.file) {
        image = req.file.filename;
    }

    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id,
            { name, image, parties },
            { new: true, runValidators: true }
        );
        if (!updatedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json(updatedCandidate);
    } catch (error) {
        res.status(400).json({ message: 'Error updating candidate', error: error.message });
    }
};

// Delete a candidate by ID
const deleteCandidate = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(id);
        if (!deletedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting candidate', error: error.message });
    }
};

// Export all functions
module.exports = {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
};
