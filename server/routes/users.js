const express = require('express');
const { getAllUsers, editUser, deleteUser } = require('../controllers/users');

const router = express.Router();

router.get('/get-all-users', getAllUsers);
router.put('/edit-user/:id', editUser);
router.delete('/delete-user/:id', deleteUser);

module.exports = router;
