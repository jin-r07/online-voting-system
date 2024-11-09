const mongoose = require("../configs/db");

const voteLogSchema = new mongoose.Schema({
    voterId: String,
    eventId: String,
    candidateId: String,
    blockHash: String,
    blockIndex: Number,
    message: String,
    timestamp: Date,
});

module.exports = mongoose.model("voteLog", voteLogSchema);