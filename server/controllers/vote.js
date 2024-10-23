const Block = require("../models/block");
const { mineBlock } = require("../utils/pow");
const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});
const { verifyToken } = require("../utils/auth");

async function submitVote(req, res) {
    const token = req.cookies.token;
    const { eventId, candidateId } = req.body;

    if (!token) {
        return res.status(401).json({ message: "You must be logged in to vote." });
    }

    if (!eventId || !candidateId) {
        return res.status(400).json({ message: "Event ID and Candidate ID are required." });
    }

    try {
        const decoded = verifyToken(token);

        const userId = decoded.id;
        const key = `${eventId}_${userId}`;

        const existingVotes = await multichain.listStreamKeyItems({ stream: "events", key });

        if (existingVotes.length > 0) {
            return res.status(400).json({ message: "You have already voted for this event." });
        }

        const latestBlocks = await multichain.listStreamItems({ stream: "events", count: 1, start: -1 });
        let previousHash = "0";
        let newIndex = 1;

        const voteData = {
            candidateId,
            userId,
        };

        if (latestBlocks.length > 0) {
            const latestBlockData = Buffer.from(latestBlocks[0].data, "hex").toString("utf8");
            if (latestBlockData) {
                const latestBlock = JSON.parse(latestBlockData);
                previousHash = latestBlock.hash || "0";
                newIndex = latestBlock.index + 1;
            } else {
                console.log("Latest block data is empty. Initializing with default values.");
                previousHash = "0";
                newIndex = 1;
            }
        }

        const block = new Block(newIndex, previousHash, Date.now(), voteData);
        const difficulty = 4;

        mineBlock(block, difficulty);

        await multichain.publish({
            stream: "events",
            key: key,
            data: Buffer.from(JSON.stringify(block)).toString("hex")
        });

        res.status(200).json({ message: "Vote successfully submitted." });
    } catch (err) {
        res.status(500).json({ error: "Error submitting vote" });
    }
}

async function extractVoteData(req, res) {
    try {
        const items = await multichain.listStreamItems({ stream: "events" });
        const votesCount = {};

        for (const item of items) {
            if (item.data && item.data !== "") {
                try {
                    const jsonString = Buffer.from(item.data, "hex").toString("utf8");

                    const voteData = JSON.parse(jsonString);

                    const candidateId = voteData.data?.candidateId;

                    if (candidateId) {
                        votesCount[candidateId] = (votesCount[candidateId] || 0) + 1;
                    } else {
                        console.log("No candidateId found in vote data");
                    }
                } catch (err) {
                    continue;
                }
            } else {
                console.log("Skipping block with empty data:", item);
            }
        }

        res.status(200).json(votesCount);
    } catch (err) {
        console.error("Error retrieving vote data:", err);
        res.status(500).json({ error: "Error retrieving vote data" });
    }
}

async function hasUserVoted(req, res) {
    const token = req.cookies.token;
    const { eventId } = req.query;

    if (!token) {
        return res.status(401).json({ message: "You must be logged in vote." });
    }

    try {
        const decoded = verifyToken(token);

        const userId = decoded.id;
        const key = `${eventId}_${userId}`;

        const existingVotes = await multichain.listStreamKeyItems({ stream: "events", key });

        if (existingVotes.length > 0) {
            return res.status(200).json({ hasVoted: true });
        } else {
            return res.status(200).json({ hasVoted: false });
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        }
        return res.status(500).json({ error: "Error checking vote status" });
    }
}

module.exports = { submitVote, extractVoteData, hasUserVoted };