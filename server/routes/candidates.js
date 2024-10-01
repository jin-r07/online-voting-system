const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidates');
const upload = require("../scripts/uploads");

// Define CRUD routes with the upload middleware for image uploads
router.post('/add-candidate', upload.single('image'), candidateController.createCandidate);
router.get('/get-all-candidates', candidateController.getCandidates);
router.get('/get-candidate-byId/:id', candidateController.getCandidateById);
router.put('/update-candidate-byId/:id', upload.single('image'), candidateController.updateCandidate);
router.delete('/delete-candidate/:id', candidateController.deleteCandidate);

module.exports = router;
