const express = require("express");
const { getLoggedInUser} = require("../controllers/profile");

const router = express.Router();

router.post("/get-loggedIn-user", getLoggedInUser);

module.exports = router;
