const express = require("express");
const { loginUser, refreshToken } = require("../controllers/login");

const router = express.Router();

router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);

module.exports = router;