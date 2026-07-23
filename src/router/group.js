const express = require("express");
const router = express.Router();
const group = require("../controller/group.js");
const auth = require("../middleware/auth.js");
const authorization = require("../middleware/authorization.js");

router.post("/", auth.verify.token, group.create);

router.delete("/:group_id", auth.verify.token, authorization.leader, group.delete);

module.exports = router;