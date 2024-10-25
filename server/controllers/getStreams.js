const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});

async function extractAllVoteData(req, res) {
    try {
        const items = await multichain.listStreamItems({ stream: "events" });
        const allVoteData = [];

        for (const item of items) {
            if (item.data && item.data !== "") {
                try {
                    const jsonString = Buffer.from(item.data, "hex").toString("utf8");
                    const voteData = JSON.parse(jsonString);

                    const voteInfo = {
                        eventId: voteData.data?.eventId,
                        candidateId: voteData.data?.candidateId,
                        publisher: item.publisher,
                        blocktime: item.blocktime,
                        txid: item.txid,
                        confirmations: item.confirmations,
                    };

                    allVoteData.push(voteInfo);
                } catch (err) {
                    console.error("Error parsing vote data:", err);
                    continue;
                }
            }
        }

        res.status(200).json(allVoteData);
    } catch (err) {
        console.error("Error retrieving vote data:", err);
        res.status(500).json({ error: "Error retrieving vote data" });
    }
}

module.exports = { extractAllVoteData };