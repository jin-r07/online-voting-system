    const Party = require('../models/parties');

    // Create a new party
    const createParty = async (req, res) => {
        try {
            const { name } = req.body;
            const image = req.file ? req.file.filename : null;

            // Check if the party already exists by name
            const existingParty = await Party.findOne({ name });
            if (existingParty) {
                return res.status(409).json({ message: 'Party with this name already exists' });
            }

            // Create and save the new party if it doesn't exist
            const newParty = new Party({ name, image });
            await newParty.save();

            res.status(201).json(newParty);
        } catch (error) {
            console.error('Error creating party:', error);
            res.status(500).json({ message: 'Error creating party' });
        }
    };

    // Get all parties
    const getParties = async (req, res) => {
        try {
            const parties = await Party.find();
            res.status(200).json(parties);
        } catch (error) {
            console.error('Error fetching parties:', error);
            res.status(500).json({ message: 'Error fetching parties' });
        }
    };

    // Get a party by ID
    const getPartyById = async (req, res) => {
        const { id } = req.params;

        try {
            const party = await Party.findById(id);
            if (!party) {
                return res.status(404).json({ message: 'Party not found' });
            }
            res.status(200).json(party);
        } catch (error) {
            console.error('Error fetching party:', error);
            res.status(500).json({ message: 'Error fetching party' });
        }
    };

    // Update a party by ID
    const updateParty = async (req, res) => {
        const { id } = req.params;
        const { name } = req.body; // Get name from body
        let image;

        if (req.file) {
            image = req.file.filename; // If a new image is uploaded
        }

        try {
            const updatedParty = await Party.findByIdAndUpdate(
                id,
                { name, image }, // Include image in the update
                { new: true }
            );
            if (!updatedParty) {
                return res.status(404).json({ message: 'Party not found' });
            }
            res.status(200).json(updatedParty);
        } catch (error) {
            console.error('Error updating party:', error);
            res.status(500).json({ message: 'Error updating party' });
        }
    };

    // Delete a party by ID
    const deleteParty = async (req, res) => {
        const { id } = req.params;

        try {
            const deletedParty = await Party.findByIdAndDelete(id);
            if (!deletedParty) {
                return res.status(404).json({ message: 'Party not found' });
            }
            res.status(204).send(); // No content to return
        } catch (error) {
            console.error('Error deleting party:', error);
            res.status(500).json({ message: 'Error deleting party' });
        }
    };

    // Export the controller functions
    module.exports = { createParty, getParties, getPartyById, updateParty, deleteParty };
