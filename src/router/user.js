const express = require("express");
const user = require("../controller/user.js");
const router = express.Router();
const auth = require("../middleware/auth.js");

router.post("/signUp", user.signUp);

router.post("/login", user.login);

router.get("/", auth.verify.token, user.getUsers);

router.get("/groups", auth.verify.token, user.getGroups);

module.exports = router;