const mongoose = require("../configs/db");

const userSchema = new mongoose.Schema ({
    email: { type: String, unique: true, required: true },
    voterIdCardPicture: { type: String, unique: true, required: true },
    voterIdCardNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required:true, enum: ["admin", "user"], default: "user" }
}, {
    timestamps: true
});

module.exports = mongoose.model("users", userSchema);