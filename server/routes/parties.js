const express = require("express");
const upload = require("../scripts/uploadsParty");
const { createParty } = require("../controllers/parties");

const router = express.Router();

router.post("/add-party", upload.single("image"), createParty);

module.exports = router;
