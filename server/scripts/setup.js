const user = require("../models/admin");
const bcrypt = require("bcrypt");

async function createAdmin() {
    try {
        const existing = await user.findOne({ adminIdNumber: "0x4F" });
        if (existing) {
            console.log("Admin already exists");
        } else {
            const newAdmin = new user({
                adminIdNumber: "0x4F",
                password: await bcrypt.hash("admin12345", 10),
                role: "admin"
            });
            await newAdmin.save();
            console.log("Admin created successfully");
        }
    } catch (e) {
        console.error(e.message);
    }
}

module.exports = { createAdmin };