const mongoose = require("../configs/db");

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "party" }],
}, { timestamps: true });

module.exports = mongoose.model("candidate", CandidateSchema);
