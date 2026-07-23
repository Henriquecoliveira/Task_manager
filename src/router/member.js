const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const member = require("../controller/member.js");
const authorization = require("../middleware/authorization.js");

router.get("/:group_id", auth.verify.token, authorization.member, member.getMembers);

router.put("/:group_id", auth.verify.token, authorization.subLeader, member.addMembers);

router.delete("/:group_id", auth.verify.token, authorization.subLeader, member.removeMembers);

module.exports = router;