const express = require("express");
const uploadCandidate = require("../scripts/uploadsCandidate");
const { createCandidate, getAllCandidates, editCandidate, deleteCandidate, getTotalCandidates } = require("../controllers/candidates");

const router = express.Router();

router.post("/add-candidate", uploadCandidate.single("image"), createCandidate);
router.get("/get-all-candidates", getAllCandidates);
router.put("/edit-candidate/:id", uploadCandidate.single("image"), editCandidate);
router.delete("/delete-candidate/:id", deleteCandidate);
router.get("/get-candidates-total", getTotalCandidates);

module.exports = router;
