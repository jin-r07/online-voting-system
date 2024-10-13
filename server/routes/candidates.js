const express = require("express");
const upload = require("../scripts/uploadsCandidate");
const { createCandidate, getAllCandidates, editCandidate, deleteCandidate } = require("../controllers/candidates");

const router = express.Router();

router.post("/add-candidate", upload.single("image"), createCandidate);
router.get("/get-all-candidates", getAllCandidates);
router.put("/edit-candidate/:id", upload.single("image"), editCandidate);
router.delete("/delete-candidate/:id", deleteCandidate);

module.exports = router;
