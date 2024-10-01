const express = require('express');
const router = express.Router();
const partyController = require('../controllers/parties');
const upload = require("../scripts/uploadsParty");

// Define CRUD routes with the upload middleware for image uploads
router.post('/add-party', upload.single('image'), partyController.createParty);
router.get('/get-all-parties', partyController.getParties);
router.get('/get-party-byId/:id', partyController.getPartyById);
router.put('/update-party-byId/:id', upload.single('image'), partyController.updateParty);
router.delete('/delete-party/:id', partyController.deleteParty);

module.exports = router;
