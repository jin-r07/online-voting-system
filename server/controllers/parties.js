const Party = require("../models/parties");

const createParty = async (req, res) => {
    const { name, shortName } = req.body;
    const image = req.file.path;

    try {
        const existingParty = await Party.findOne({ 
            $or: [ { name }, { shortName } ] 
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

module.exports = { createParty, };
