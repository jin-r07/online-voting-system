const mongoose = require("../configs/db");

const voteLogSchema = new mongoose.Schema({
    voterId: String,
    eventId: String,
    candidateId: String,
    blockHash: String,
    txid: String,
    message: String,
    timestamp: Date,
});

module.exports = mongoose.model("voteLog", voteLogSchema);