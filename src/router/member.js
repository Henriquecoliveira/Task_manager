const express = require("express");
const router = express.Router();
const tokenVerify = require("../middleware/auth.js");
const member = require("../controller/member.js");
const authorization = require("../middleware/authorization.js");

router.get("/:group_id", tokenVerify, authorization.member, member.getMembers);

router.put("/:group_id", tokenVerify, authorization.subLeader, member.addMembers);

router.delete("/:group_id", tokenVerify, authorization.subLeader, member.removeMembers);

module.exports = router;