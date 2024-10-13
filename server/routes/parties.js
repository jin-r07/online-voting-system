const express = require("express");
const upload = require("../scripts/uploadsParty");
const { createParty, getAllParties } = require("../controllers/parties");

const router = express.Router();

router.post("/add-party", upload.single("image"), createParty);
router.get("/get-all-parties", getAllParties);

module.exports = router;
