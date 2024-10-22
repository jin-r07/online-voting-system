const express = require("express");
const { sendContactMessage } = require("../controllers/contact")

const router = express.Router();

router.post("/send-contact-message", sendContactMessage);

module.exports = router;
