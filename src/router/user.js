const express = require("express");
const {user} = require("../controller/user.js");
const router = express.Router();
const tokenVerify = require("../middleware/auth.js");

router.post("/user/signUp", user.signUp);

router.post("/user/login", user.login);

router.get("/user", tokenVerify, user.getUsers);

module.exports = router;