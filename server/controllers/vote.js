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
        return res.status(401).json({ message: "You must be logged in to vote. Please log in to continue." });
    }

    if (!eventId || !candidateId) {
        return res.status(400).json({ message: "Event ID and Candidate ID are required." });
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
            key: key,
            data: Buffer.from(JSON.stringify(voteData)).toString('hex')
        });

        res.status(200).json({ message: "Vote successfully submitted." });
    } catch (err) {
        res.status(500).json({ error: "Error submitting vote" });
    }
}

async function extractVoteData(req, res) {
    try {
        const items = await multichain.listStreamItems({ stream: 'events' });
        const votesCount = {};

        for (const item of items) {
            if (item.data) {
                const jsonString = Buffer.from(item.data, 'hex').toString('utf8');
                const voteData = JSON.parse(jsonString);
                const candidateId = voteData.candidateId;

                if (candidateId) {
                    votesCount[candidateId] = (votesCount[candidateId] || 0) + 1;
                }
            }
        }
        res.status(200).json(votesCount);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving vote data" });
    }
}

async function hasUserVoted(req, res) {
    const userId = req.cookies.userId;
    const { eventId } = req.query;

    if (!userId) {
        return res.status(401).json({ message: "You must be logged in to check vote status." });
    }

    try {
        const key = `${eventId}_${userId}`;
        const existingVotes = await multichain.listStreamKeyItems({ stream: 'events', key });

        if (existingVotes.length > 0) {
            return res.status(200).json({ hasVoted: true });
        } else {
            return res.status(200).json({ hasVoted: false });
        }
    } catch (err) {
        res.status(500).json({ error: "Error checking vote status" });
    }
}

module.exports = { submitVote, extractVoteData, hasUserVoted };
