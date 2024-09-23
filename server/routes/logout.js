const express = require("express");
const { authenticateToken } = require("../utils/authMiddleware");

const router = express.Router();

router.post("/user-logout", authenticateToken, (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Successfully logged out" });
});

module.exports = router;
