const express = require("express");
const uploadUser = require("../scripts/uploads");
const { getAllUsers, editUser, deleteUser, getTotalUsers, editUserEmail, changePassword, changePassword2 } = require("../controllers/users");

const router = express.Router();

router.get("/get-all-users", getAllUsers);
router.put("/edit-user/:id", uploadUser.single("voterIdCardPicture"), editUser);
router.delete("/delete-user/:id", deleteUser);
router.get("/get-users-total", getTotalUsers);
router.put("/edit-user-email/:id", editUserEmail);
router.put("/forgot-password", changePassword);
router.put("/forgot-password2", changePassword2);

module.exports = router;
