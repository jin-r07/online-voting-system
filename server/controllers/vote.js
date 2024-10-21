const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});

async function submitVote(req, res) {
    const userId = req.cookies.userId;
    const { eventId, candidateId } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const key = `${eventId}_${userId}`;

        const existingVotes = await multichain.listStreamKeyItems({ stream: 'events', key });
        if (existingVotes.length > 0) {
            return res.status(400).json({ message: "You have already voted for this event." });
        }

        const voteData = {
            candidateId,
            userId,
        };

        await multichain.publish({
            stream: 'events',
            key: eventId,
            data: Buffer.from(JSON.stringify(voteData)).toString('hex')
        });

        res.status(200).json({ message: "Vote successfully submitted." });
    } catch (err) {
        res.status(500).json({ error: "Error submitting vote" });
    }
}


module.exports = { submitVote };