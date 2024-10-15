const express = require("express");
const uploadUser = require("../scripts/uploads");
const { getAllUsers, editUser, deleteUser } = require("../controllers/users");

const router = express.Router();

router.get("/get-all-users", getAllUsers);
router.put("/edit-user/:id", uploadUser.single("voterIdCardPicture"), editUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;
