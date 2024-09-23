const express = require("express");
const upload = require("../scripts/uploads");
const { registerUser } = require("../controllers/register");

const router = express.Router();

router.post("/register-new-user", upload.single("picture"), registerUser);

module.exports = router;
