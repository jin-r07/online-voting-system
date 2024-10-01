const mongoose = require("../configs/db");

const PartySchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    image: { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model("party", PartySchema);
