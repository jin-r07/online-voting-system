const mongoose = require("../configs/db");

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "party", required: true },
});

module.exports = mongoose.model("candidate", candidateSchema);
