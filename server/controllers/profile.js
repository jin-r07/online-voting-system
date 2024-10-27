const path = require("path");
const User = require("../models/users");
const { verifyToken } = require("../utils/auth");

async function getLoggedInUser(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "You must be logged in to view this information." });
    }

    try {
        const decoded = verifyToken(token);
        const userId = decoded.id;

        let user = await User.findById(userId).select("-password -__v");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user = user.toObject();
        if (user.voterIdCardPicture) {
            user.voterIdCardPicture = `http://localhost:8080/uploads/users/${path.basename(user.voterIdCardPicture)}`;
        }

        return res.status(200).json({ user });
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        }
        return res.status(500).json({ error: "Error retrieving user information." });
    }
}

module.exports = { getLoggedInUser };
