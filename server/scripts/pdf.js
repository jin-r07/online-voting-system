const fs = require("fs");
const path = require("path");
const axios = require("axios");
const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});
const { jsPDF } = require("jspdf");

const generateVotePDF = async (eventId, votesCount) => {
    try {
        const eventResponse = await axios.get(`http://localhost:8080/api-admin/get-events-completed/${eventId}`);
        const event = eventResponse.data;
        const name = event.eventName;
        const doc = new jsPDF();

        doc.setFontSize(23);

        const titleWidth = 190;

        const titleLines = doc.splitTextToSize(`${name}`, titleWidth);
        doc.text(titleLines, 10, 20);

        doc.setFontSize(13);
        doc.text(`Start Date: ${new Date(event.start).toLocaleString()}`, 10, 40);
        doc.text(`End Date: ${new Date(event.end).toLocaleString()}`, 10, 50);

        doc.setFontSize(12);
        let verticalPosition = 70;

        for (const candidate of event.candidates) {
            const totalVotes = votesCount[candidate._id] || 0;

            const rectX = 5;
            const rectY = verticalPosition - 3;
            const rectWidth = 200;
            const rectHeight = 60;

            doc.setDrawColor(0, 0, 0);
            doc.rect(rectX, rectY, rectWidth, rectHeight);

            if (candidate.partyImage) {
                const partyImagePath = path.join(__dirname, 'uploads', 'parties', path.basename(candidate.partyImage));
                if (fs.existsSync(partyImagePath)) {
                    const partyImageData = fs.readFileSync(partyImagePath).toString("base64");
                    doc.addImage(partyImageData, 'JPEG', 10, verticalPosition, 40, 40);
                }
            }

            doc.text(`Party: ${candidate.partyName}`, 60, verticalPosition + 10);
            verticalPosition += 30;

            if (candidate.image) {
                const candidateImagePath = path.join(__dirname, 'uploads', 'candidates', path.basename(candidate.image));
                if (fs.existsSync(candidateImagePath)) {
                    const candidateImageData = fs.readFileSync(candidateImagePath).toString("base64");
                    doc.addImage(candidateImageData, 'JPEG', 10, verticalPosition, 20, 20);
                }
            }

            doc.text(`Candidate: ${candidate.name}`, 60, verticalPosition + 10);
            doc.text(`Votes: ${totalVotes}`, 60, verticalPosition + 20);
            verticalPosition += 40;

            if (verticalPosition > doc.internal.pageSize.height - 20) {
                doc.addPage();
                verticalPosition = 20;
            }
        }

        const filePath = path.join(__dirname, "pdf", `${name}.pdf`);
        doc.save(filePath);

        return filePath;

    } catch (err) {
        console.error("Error generating the PDF:", err);
        throw err;
    }
};

const extractVoteDataForEvent = async (eventId) => {
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

                    if (voteEventId && voteEventId.toString() === eventId.toString() && candidateId) {
                        if (!votesCount[candidateId]) {
                            votesCount[candidateId] = 0;
                        }
                        votesCount[candidateId]++;
                    }
                } catch (err) {
                    console.error("Error parsing vote data:", err);
                    continue;
                }
            } else {
                console.warn("Skipping item with empty data:", item);
            }
        }

        return votesCount;
    } catch (err) {
        throw new Error("Error retrieving vote data");
    }
};

module.exports = { generateVotePDF, extractVoteDataForEvent };
