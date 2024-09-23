const express = require("express");
const { authenticateToken } = require("../utils/authMiddleware");
const { getUserById } = require("../controllers/authenticated");

const router = express.Router();

router.get("/user-authenticated", authenticateToken, getUserById);

module.exports = router;