const express = require("express");
const { getLoggedInUser } = require("../controllers/profile");

const router = express.Router();

router.get("/get-loggedIn-user", getLoggedInUser);

module.exports = router;
