const Block = require("../models/block");
const { mineBlock } = require("../utils/pow");
const multichain = require("../configs/multichain");
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
        console.log(decoded);
        const userId = decoded.id;
        const key = `${eventId}_${userId}`;

        const existingVotes = await multichain.listStreamKeyItems({ stream: "events", key });

        if (existingVotes.length > 0) {
            return res.status(400).json({ message: "You have already voted for this event." });
        }

        let previousHash = "0";
        let newIndex = 1;
        let useDefaultValues = false;

        const eventKeyItems = await multichain.listStreamKeyItems({ stream: "events", key: eventId });
        if (eventKeyItems.length > 0) {
            useDefaultValues = true;
        }

        const latestBlocks = await multichain.listStreamItems({ stream: "events", count: 1, start: -1 });

        if (latestBlocks.length > 0 && !useDefaultValues) {
            const latestBlockData = Buffer.from(latestBlocks[0].data, "hex").toString("utf8");
            if (latestBlockData) {
                const latestBlock = JSON.parse(latestBlockData);
                previousHash = latestBlock.hash || "0";
                newIndex = latestBlock.index + 1;
            } else {
                console.log("Latest block data is empty. Using default values.");
            }
        }

        const voteData = {
            eventId,
            candidateId,
            userId,
        };

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
    const { eventId } = req.query;

    try {
        const items = await multichain.listStreamItems({ stream: "events" });
        const votesCount = {};

        for (const item of items) {
            if (item.data && item.data !== "") {
                try {
                    const jsonString = Buffer.from(item.data, "hex").toString("utf8");
                    const voteData = JSON.parse(jsonString);

                    const voteEventId = voteData.data?.eventId;
                    const candidateId = voteData.data?.candidateId;

                    if (voteEventId === eventId && candidateId) {
                        if (!votesCount[candidateId]) {
                            votesCount[candidateId] = 0;
                        }
                        votesCount[candidateId]++;
                    }
                } catch (err) {
                    console.error("Error parsing vote data:", err);
                    continue;
                }
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
            return res.status(200).json({ hasVoted: true, eventId });
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