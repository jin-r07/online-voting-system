const express = require("express");
const { adminLogin } = require("../controllers/adminLogin");

const router = express.Router();

router.post("/login-admin", adminLogin);

module.exports = router;