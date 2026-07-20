const express = require("express");
const router = express.Router();
const group = require("../controller/group.js");
const tokenVerify = require("../middleware/auth.js");

router.post("/newGroup", tokenVerify, group.newGroup);

router.put("/addMembers", tokenVerify, group.addMembers);

module.exports = router;