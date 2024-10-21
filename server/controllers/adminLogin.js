const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

async function adminLogin(req, res) {
    try {
        const { adminIdNumber, password } = req.body;

        const adminExists = await Admin.findOne({ adminIdNumber });
        if (!adminExists) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, adminExists.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Admin login successful" });
    } catch (e) {
        res.status(500).json({ message: "An error occurred during admin login" });
    }
}

module.exports = { adminLogin };
