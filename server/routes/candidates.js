const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidates');

// Define CRUD routes
router.post('/add-candidate', candidateController.createCandidate);
router.get('/get-all-candidates', candidateController.getCandidates);
router.get('/get-candidate-byId/:id', candidateController.getCandidateById);
router.put('/update-candidate-byId/:id', candidateController.updateCandidate);
router.delete('/delete-candidate/:id', candidateController.deleteCandidate);

module.exports = router;
