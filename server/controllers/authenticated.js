const user = require("../models/user");

async function getUserById(req, res) {
    try {
        const userId = req.user.id;
        const getUser = await user.findById(userId);
        if (!getUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(getUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getUserById };