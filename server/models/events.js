const mongoose = require("../configs/db");

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "candidate", required: true }],
});

module.exports = mongoose.model("event", eventSchema);
