const express = require("express");
const user = require("../controller/user.js");
const router = express.Router();
const tokenVerify = require("../middleware/auth.js");

router.post("/signUp", user.signUp);

router.post("/login", user.login);

router.get("/", tokenVerify, user.getUsers);

router.get("/groups", tokenVerify, user.getGroups);

module.exports = router;