const express = require("express");
const jwt = require("jsonwebtoken");
const logger = require("../../helpers/logger");
const UserModel = require("../../models/user");
const { cryptPassword, validatePassword } = require("../../helpers/passwords");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    logger.info("for registration email and password are required", {
      request: req,
    });
    res
      .status(400)
      .json({ message: "for registration email and password are required" });
  }
  let user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    logger.warn("user already registered\n", { request: req.body });
    res.status(409).json({ message: "user already registered" });
  }
  user = await UserModel.create({
    email: req.body.email,
    password: await cryptPassword(req.body.password),
  });
  logger.debug(user);
  res.json({ registered: user.email });
});

router.post("/login", async (req, res, next) => {
  // logger.info({ body: req.body, headers: req.headers });
  if (!req.body.email || !req.body.password) {
    let body = req.body;
    logger.debug(body);
    return res
      .status(400)
      .json({ message: "Error. Email and Password are Required" });
  }
  logger.debug(req.body.email);
  const user = await UserModel.findOne({
    email: req.body.email /*TODO:password with bcrypt*/,
  });
  logger.debug(user);
  if (!user) {
    logger.error("login attempt failed", { requestBody: req.body });
    res.status(400).json({ message: "Error. Wrong login or password" });
  }
  const token = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15 days" }
  );
  res.json({ access_token: token });
});

router.delete("/user-flush", async (req, res, next) => {
  const result = await UserModel.deleteMany({});
  logger.info(result);
  res.json({ ok: true });
});

router.get("/count-users", async (req, res, next) => {
  const count = await UserModel.estimatedDocumentCount({});
  logger.info("user count:", count);
  res.json({ count });
});

module.exports = router;
