const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});

const generateVotePDF = async (eventId, votesCount) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, "pdf", `event_${eventId}_votes.pdf`);
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(25).text(`Vote Results for Event: ${eventId}`, { align: "center" });

    doc.moveDown();

    Object.entries(votesCount).forEach(([candidateId, count]) => {
        doc.fontSize(15).text(`Candidate ID: ${candidateId} - Votes: ${count}`);
    });

    doc.end();

    return new Promise((resolve, reject) => {
        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
    });
};

const extractVoteDataForEvent = async (eventId) => {
    const items = await multichain.listStreamItems({ stream: "events" });
    const votesCount = {};

    for (const item of items) {
        if (item.data && item.data !== "") {
            try {
                const jsonString = Buffer.from(item.data, "hex").toString("utf8");
                const voteData = JSON.parse(jsonString);

                if (voteData.eventId === eventId) {
                    const candidateId = voteData.data?.candidateId;
                    if (candidateId) {
                        votesCount[candidateId] = (votesCount[candidateId] || 0) + 1;
                    }
                }
            } catch (err) {
                console.error("Error parsing vote data:", err);
            }
        }
    }

    return votesCount;
};

module.exports = { generateVotePDF, extractVoteDataForEvent };