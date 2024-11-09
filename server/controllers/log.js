const VoteLog = require("../models/log");

async function getVoteLogs(req, res) {
    try {
        const voteLogs = await VoteLog.find();
        res.status(200).json(voteLogs);
    } catch (err) {
        res.status(500).json({ error: "Error fetching vote logs" });
    }
}

module.exports = { getVoteLogs };
