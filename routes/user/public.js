var express = require("express");
var jwt = require("jsonwebtoken");
var logger = require("../../helpers/logger");
var { UserModel } = require("../../models/user");
var { CommentModel } = require("../../models/comment");
var { PostModel } = require("../../models/post");
var router = express.Router();
var bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  if (req.body.password === undefined || req.body.password === "") {
    logger.debug("Il faut un mot de passe pour s'enregistrer");
    res.status(400).json({ message: "Veuillez indiquer un mot de passe" });
  } else if (req.body.password.length < 10) {
    logger.debug("password must have at least 10 characters");
    res.status(400).json({
      message: "Le mot de passe doit contenir au moins 10 caractères",
    });
  } else if (req.body.email === undefined || req.body.email === "") {
    logger.debug("Email required to subscribe");
    res
      .status(400)
      .json({ message: "Veuillez saisir un email pour vous enregistrer" });
  } else if (
    !req.body.email.match(
      // eslint-disable-next-line no-control-regex
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    )
  ) {
    logger.debug("invalid email");
    res
      .status(400)
      .json({ message: "Veuillez entrez un format d'email valide" });
  } else {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    var userType = "lambda";
    try {
      var user = await UserModel.create({
        email: userEmail,
        password: userPassword,
        type: userType,
      });
      res.json({ user });
    } catch (err) {
      logger.debug(err);
      if (
        err.original &&
        err.original.code === "ER_DUP_ENTRY" &&
        err.original.sqlMessage.includes("'users.email'")
      ) {
        res.status(409).json({ message: "user already registered" });
      } else {
        res.status(500).json({ message: "unknown server error" });
      }
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    if (userEmail === undefined || userPassword === undefined) {
      logger.debug("email and password are required");
      res.status(400).json({ message: "email and password are required" });
    }
    var user = await UserModel.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      logger.debug("user not registered");
      res.status(401).json({ message: "user not registered" });
    }
    var isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      logger.debug("Wrong password");
      res.status(401).json({ message: "Wrong password" });
    }
    var token = jwt.sign(
      { email: user.email, type: user.type, id: user.id }, //vient de la BDD
      process.env.JWT_SECRET
    );
    res.status(200).json({ access_token: token });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "internal server error" });
  }
});

//FIXME: refactor routes auth/public user (pepo)

router.get("/from-post", async (req, res) => {
  logger.info("bobby");
  var postId = req.body.postId;
  try {
    var comment = await PostModel.findOne({ where: { id: postId } });
    var user = await comment.getUser();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json("debug");
  }
});

router.get("/from-comment", async (req, res) => {
  var commentId = req.body.commentId;
  try {
    var comment = await CommentModel.findOne({ where: { id: commentId } });
    var user = await comment.getUser();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json("debug");
  }
});

module.exports = router;
