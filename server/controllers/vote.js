const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});

async function submitVote(req, res) {
    const userId = req.cookies.userId;
    const { eventId, candidateId } = req.body;

    console.log("Received vote submission:", { userId, eventId, candidateId });

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!eventId || !candidateId) {
        return res.status(400).json({ message: "Event ID and Candidate ID are required." });
    }

    try {
        const key = eventId; // Use eventId as the key

        // Fetch the current data for this event
        const existingVotes = await multichain.listStreamKeyItems({ stream: 'events', key });

        let eventData = {};
        if (existingVotes.length > 0) {
            // Decode existing data
            const existingDataHex = existingVotes[0].data;
            const existingDataJson = Buffer.from(existingDataHex, 'hex').toString();
            eventData = JSON.parse(existingDataJson);
        }

        // Initialize candidates if not present
        if (!eventData.candidates) {
            eventData.candidates = {};
        }

        // Initialize candidate if not present
        if (!eventData.candidates[candidateId]) {
            eventData.candidates[candidateId] = [];
        }

        // Check if userId already voted for this candidate
        if (eventData.candidates[candidateId].includes(userId)) {
            return res.status(400).json({ message: "You have already voted for this candidate." });
        }

        // Add userId to the candidate's list
        eventData.candidates[candidateId].push(userId);

        // Publish updated data back to the Multichain
        await multichain.publish({
            stream: 'events',
            key: eventId,
            data: Buffer.from(JSON.stringify(eventData)).toString('hex')
        });

        res.status(200).json({ message: "Vote successfully submitted." });
    } catch (err) {
        console.error("Error submitting vote:", err);
        res.status(500).json({ error: "Error submitting vote" });
    }
}


module.exports = { submitVote };