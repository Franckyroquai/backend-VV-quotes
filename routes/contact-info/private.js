const express = require("express");
const router = express.Router();
const logger = require("../../helpers/logger");

const { ContactInfoModel } = require("../../models/contact-info");

router.post("/create-one", async (req, res) => {
  res.send("todo");
});

router.post("/update-one", async (req, res) => {
  res.send("todo");
});

router.post("/delete-one", async (req, res) => {
  res.send("todo");
});

router.post("/link", async (req, res) => {
  res.send("todo");
});

router.post("/validate", async (req, res) => {
  res.send("todo");
});

module.exports = router;
