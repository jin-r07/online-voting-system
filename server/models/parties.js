const mongoose = require("../configs/db");

const partySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    shortName: { type: String, required: true, unique: true },
    image: { type: String, required: true },  
});

module.exports = mongoose.model("party", partySchema);
