const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { CommentModel } = require("../../models/comment");

router.get("all", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

module.exports = router;
