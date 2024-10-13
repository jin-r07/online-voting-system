const Party = require("../models/parties");

async function createParty(req, res) {
    const { name, shortName } = req.body;
    const image = req.file.path;

    try {
        const existingParty = await Party.findOne({
            $or: [{ name }, { shortName }]
        });

        if (existingParty) {
            return res.status(400).json({ error: "Party with this name or short name already exists" });
        }

        const newParty = new Party({ name, shortName, image });
        await newParty.save();
        res.status(201).json(newParty);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating party" });
    }
};

async function getAllParties(req, res) {
    try {
        const parties = await Party.find();
        const partiesWithImageURLs = parties.map(party => {
            return {
                ...party.toObject(),
                image: `http://localhost:8080/uploads/parties/${party.image.split('\\').pop()}`
            };
        });
        res.status(200).json(partiesWithImageURLs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching parties" });
    }
}

async function editParty(req, res) {
    const { id } = req.params;
    const { name, shortName } = req.body;
    let image;

    try {
        const party = await Party.findById(id);
        if (!party) {
            return res.status(404).json({ error: "Party not found" });
        }

        if (req.file) {
            image = req.file.path;
        } else {
            image = party.image;
        }

        party.name = name;
        party.shortName = shortName;
        party.image = image;

        await party.save();
        res.status(200).json(party);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating party" });
    }
}

async function deleteParty(req, res) {
    const { id } = req.params;

    try {
        const deletedParty = await Party.findByIdAndDelete(id);
        if (!deletedParty) {
            return res.status(404).json({ error: "Party not found" });
        }

        res.status(200).json({ message: "Party deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting party" });
    }
}

module.exports = { createParty, getAllParties, editParty, deleteParty };
