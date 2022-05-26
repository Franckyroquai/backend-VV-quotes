var express = require("express");
var router = express.Router();
var logger = require("../../helpers/logger");

var { ContactInfoModel } = require("../../models/contact-info");

router.post("/create-one", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/update-one", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/delete-one", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/link", async (req, res) => {
  res.send("todo"); //TODO: to implement
});

router.post("/validate", async (req, res) => {
  res.send("todo"); //TODO: to implement for pepo
});

module.exports = router;
