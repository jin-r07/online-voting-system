const bcrypt = require("bcrypt");
const User = require("../models/users");
const { generateToken, verifyToken, generateRefreshToken } = require("../utils/auth");

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (!userExists) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(userExists);
        res.cookie("token", token, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000
        });

        res.status(200).json({ message: "Login successful" });
    } catch (e) {
        res.status(500).json({ message: "An error occurred during login" });
    }
}

async function refreshToken(req, res) {
    try {
        const { oldToken } = req.body;

        const decodedToken = verifyToken(oldToken);
        if (!decodedToken) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const userExists = await User.findById(decodedToken.id);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const newToken = generateRefreshToken(userExists);
        res.status(200).json({ token: newToken });
    } catch (e) {
        res.status(500).json({ message: "Failed to refresh token" });
    }
}

module.exports = { loginUser, refreshToken };