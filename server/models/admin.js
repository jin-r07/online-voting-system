const mongoose = require("../configs/db");

const adminSchema = new mongoose.Schema ({
    adminIdNumber: { type: String, unique: true, required: true  },
    password: { type: String, required: true  },
    role: { type: String, required: true, enum: ["admin", "user"], default: "admin" }
}, {
    timestamps: true
});

module.exports = mongoose.model("admin", adminSchema);