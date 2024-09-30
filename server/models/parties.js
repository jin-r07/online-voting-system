const mongoose = require("../configs/db");

const PartySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("party", PartySchema);
