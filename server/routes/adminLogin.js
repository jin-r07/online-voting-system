const express = require("express");
const { adminLogin, adminRefreshToken } = require("../controllers/adminLogin");

const router = express.Router();

router.post("/login-admin", adminLogin);
router.post("/refresh-token-admin", adminRefreshToken);

module.exports = router;