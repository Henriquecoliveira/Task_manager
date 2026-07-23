const express = require("express");
const router = express.Router();
const task_step = require("../controller/task_step.js");
const auth = require("../middleware/auth");
const authorization = require("../middleware/authorization.js");

router.post("/:group_id/:task_id", auth.verify.token, authorization.subLeader, task_step.create);

router.put("/:group_id/:task_id", auth.verify.token, authorization.subLeader, task_step.modify);

router.patch("/:group_id/:task_id", auth.verify.token, authorization.member, task_step.updateStatus);

router.delete("/:group_id/:task_id", auth.verify.token, authorization.subLeader, task_step.delete);

router.get("/:group_id/:task_id", auth.verify.token, authorization.member, task_step.get);

module.exports = router;