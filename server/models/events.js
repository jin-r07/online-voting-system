const mongoose = require("../configs/db");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "candidate" }],
    date: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("event", EventSchema);
