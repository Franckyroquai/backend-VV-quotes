const express = require("express");
const logger = require("../../helpers/logger");
const { UserModel } = require("../../models/sql-user");
const router = express.Router();

router.get("/profile", async (req, res) => {});

router.delete("/delete", async (req, res) => {});

router.get("/count", async (req, res) => {});

module.exports = router;
