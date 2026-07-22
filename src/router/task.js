const express = require("express");
const router = express.Router();
const task = require("../controller/task.js");
const tokenVerify = require("../middleware/auth");
const authorization = require("../middleware/authorization.js");

router.post("/:group_id", tokenVerify, authorization.subLeader, task.create);

router.put("/:group_id", tokenVerify, authorization.subLeader, task.modify);

router.patch("/:group_id", tokenVerify, authorization.member, task.updateStatus);

router.delete("/:group_id", tokenVerify, authorization.subLeader, task.delete);

router.get("/:group_id", tokenVerify, authorization.member, task.get);

module.exports = router;