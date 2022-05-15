const express = require("express");
const logger = require("../../helpers/logger");
const { UserModel } = require("../../models/user");
const router = express.Router();

router.post("/create-one", async (req, res) => {
  res.send("todo");
});

router.post("/update", async (req, res) => {
  res.send("todo");
});

router.post("/authorization", async (req, res) => {
  res.send("todo");
});

router.get("/profile", async (req, res) => {});

router.delete("/delete", async (req, res) => {});

router.get("/count", async (req, res) => {});

module.exports = router;
