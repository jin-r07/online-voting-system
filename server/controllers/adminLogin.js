const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const { generateToken, verifyToken, generateRefreshToken } = require("../utils/auth");

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

        const token = generateToken(adminExists);
        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000
        });

        res.status(200).json({ message: "Admin login successful" });
    } catch (e) {
        res.status(500).json({ message: "An error occurred during admin login" });
    }
}

async function adminRefreshToken(req, res) {
    try {
        const { oldToken } = req.body;

        const decodedToken = verifyToken(oldToken);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const adminExists = await Admin.findById(decodedToken.id);
        if (!adminExists) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const newToken = generateRefreshToken(adminExists);
        res.status(200).json({ token: newToken });
    } catch (e) {
        res.status(500).json({ message: "Failed to refresh admin token" });
    }
}

module.exports = { adminLogin, adminRefreshToken };
