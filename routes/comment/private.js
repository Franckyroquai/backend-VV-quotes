const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { CommentModel } = require("../../models/comment");

router.post("/create-one", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/update-one", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/delete-one", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/link", async (req, res) => {
  res.send("todo");//TODO: to implement
});

router.post("/validate", async (req, res) => {
  res.send("todo");//TODO: to implement
});

module.exports = router;
