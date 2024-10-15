const express = require("express");
const uploadParty = require("../scripts/uploadsParty");
const { createParty, getAllParties, editParty, deleteParty } = require("../controllers/parties");

const router = express.Router();

router.post("/add-party", uploadParty.single("image"), createParty);
router.get("/get-all-parties", getAllParties);
router.put('/edit-party/:id', uploadParty.single("image"), editParty);
router.delete('/delete-party/:id', deleteParty);

module.exports = router;
