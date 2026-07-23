const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

router.post("/", auth.verify.refreshToken);

module.exports = router;