const express = require("express");
const router = express.Router();
const group = require("../controller/group.js");
const tokenVerify = require("../middleware/auth.js");
const authorization = require("../middleware/authorization.js");

router.post("/", tokenVerify, group.create);

router.delete("/:group_id", tokenVerify, authorization.leader, group.delete);

module.exports = router;