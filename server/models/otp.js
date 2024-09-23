const mongoose = require("../configs/db");

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expires: {
        type: Date,
        required: true,
        index: { expires: "5m" }
    }
});

module.exports = mongoose.model("otp", otpSchema);
