const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { PostModel } = require("../../models/post");

router.get("/all", async (req, res) => {
  res.send("todo");
});

module.exports = router;
