const mongoose = require("../configs/db");

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "candidate", required: true }],
    status: { type: String, enum: ["active", "inactive", "completed"], default: "inactive" },
    start: { type: Date, required: true },
    end: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("event", eventSchema);
