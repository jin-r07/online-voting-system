const Block = require("../models/block");
const VoteLog = require("../models/log");
const { mineBlock } = require("../utils/pow");
const multichain = require("../configs/multichain");
const { verifyToken } = require("../utils/auth");
const Event = require("../models/events");

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

        const userVoterId = decoded.voterIdCardNumber;
        const key = `${eventId}_${userVoterId}`;

        const existingVotes = await multichain.listStreamKeyItems({ stream: "events", key });

        if (existingVotes.length > 0) {
            return res.status(400).json({ message: "You have already voted for this event." });
        }

        let previousHash = "8f54a0a0b61e5b4d0215dc1083703e6f70e2d390c23f9a58c8b89b7b29d215f3";
        let newIndex = 1;
        let useDefaultValues = false;

        const eventKeyItems = await multichain.listStreamKeyItems({ stream: "events", key: eventId });
        if (eventKeyItems.length > 0) {
            useDefaultValues = false;
        } else {
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
            userVoterId,
        };

        const block = new Block(newIndex, previousHash, Date.now(), voteData);
        console.log(block);
        const difficulty = 4;

        mineBlock(block, difficulty);

        const transactionId = await multichain.publish({
            stream: "events",
            key: key,
            data: Buffer.from(JSON.stringify(block)).toString("hex")
        });

        const logEntry = new VoteLog({
            voterId: userVoterId,
            eventId,
            candidateId,
            blockHash: block.hash,
            txid: transactionId,
            message: "Vote successfully submitted."
        });

        await logEntry.save();

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

        const userVoterId = decoded.voterIdCardNumber;
        const key = `${eventId}_${userVoterId}`;

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

async function getUserVoteDetails(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "You must be logged in to view your vote details." });
    }

    try {
        const decoded = verifyToken(token);
        const userVoterId = decoded.voterIdCardNumber;

        // Get all the vote entries from the "events" stream
        const existingVotes = await multichain.listStreamItems({ stream: "events" });

        // Filter out the votes that match the user's voterIdCardNumber
        const filteredVotes = existingVotes.filter(vote => {
            return vote.keys.some(voteKey => {
                const keyParts = voteKey.split('_');
                return keyParts[1] === userVoterId;
            });
        });

        if (filteredVotes.length === 0) {
            return res.status(404).json({ message: "No votes found for this voter." });
        }

        // Process each filtered vote and collect the necessary data
        const voteDetails = [];

        for (const vote of filteredVotes) {
            if (!vote.data || vote.data === "") {
                continue; // Skip empty or invalid data
            }

            let voteData;
            try {
                voteData = Buffer.from(vote.data, "hex").toString("utf8");
            } catch (error) {
                console.error("Error decoding vote data:", error);
                continue; // Skip if there's an error decoding the vote data
            }

            if (!voteData || voteData === "null") {
                continue; // Skip if invalid or null data
            }

            const parsedVoteData = JSON.parse(voteData);

            // Fetch event details based on eventId in the vote data
            const event = await Event.findById(parsedVoteData.data.eventId).populate({
                path: "candidates",
                populate: {
                    path: "party",
                    select: "name image"
                }
            });

            if (!event) {
                console.error("Event not found for vote:", parsedVoteData);
                continue; // Skip if event not found
            }

            // Get the candidate details for the selected candidateId in the vote data
            const candidate = event.candidates.find(candidate => candidate._id.toString() === parsedVoteData.data.candidateId);

            if (!candidate) {
                console.error("Candidate not found for vote:", parsedVoteData);
                continue; // Skip if candidate not found
            }

            // Format the vote response
            const voteResponse = {
                parsedVoteData,
                event: {
                    name: event.eventName,
                },
                candidate: {
                    name: candidate.name,
                    imageUrl: `http://localhost:8080/uploads/candidates/${candidate.image.split('\\').pop()}`,
                },
                party: {
                    name: candidate.party ? candidate.party.name : null,
                    imageUrl: candidate.party ? `http://localhost:8080/uploads/parties/${candidate.party.image.split('\\').pop()}` : null,
                }
            };

            voteDetails.push(voteResponse);
        }

        if (voteDetails.length === 0) {
            return res.status(404).json({ message: "No valid vote data found for this voter." });
        }

        // Return all the vote details for the user
        res.status(200).json(voteDetails);

    } catch (err) {
        console.error("Error fetching user vote details:", err);
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        }
        return res.status(500).json({ error: "Error fetching vote details" });
    }
}

module.exports = { submitVote, extractVoteData, hasUserVoted, getUserVoteDetails };
