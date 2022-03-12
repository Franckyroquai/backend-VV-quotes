const express = require("express");
const jwt = require("jsonwebtoken");
const logger = require("../../helpers/logger");
const UserModel = require("../../models/user");
const { cryptPassword } = require("../../helpers/passwords");

const router = express.Router();
//TODO: reset password Functionality
router.post("/register", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    logger.info("for registration email and password are required", {
      request: req,
    });
    res
      .status(400)
      .json({ message: "For registration email and password are required" });
  }

  let userIsOk = false;
  let preValidatedEmails;
  if (process.env.USER_MAILS) {
    preValidatedEmails = process.env.USER_MAILS.split(",");
  } else {
    logger.error("no prevalidated emails in env");
    res.status(403).json({ reason: "invalid Email" });
  }
  for (let i = 0; i < preValidatedEmails.length; i++) {
    if (preValidatedEmails[i] === req.body.email) {
      userIsOk = true;
    }
  }
  if (!userIsOk) {
    res.status(403).send("this email can't register");
    //TODO: throw error ?
    return;
  }

  let user = await UserModel.findOne({ email: req.body.email }); //check dans la BD si un utilisateur a déjà cet email
  if (user) {
    logger.warn("user already registered\n", { request: req.body }); //log crée un historique d'erreurs dans la console
    res.status(409).json({ message: "user already registered" }); //envoi message d'erreur au client
  }
  user = await UserModel.create({
    //pas d'erreurs, traitement standard
    email: req.body.email,
    password: await cryptPassword(req.body.password),
  });
  logger.debug(user);
  res.json({ registered: user.email }); //confirme l'enregistrement en affichant l'email
});

router.post("/login", async (req, res) => {
  // logger.info({ body: req.body, headers: req.headers });
  if (!req.body.email || !req.body.password) {
    logger.info("Error. Email and Password are Required", {
      request: req,
    });
    res.status(400).json({ message: "Error. Email and Password are Required" });
  }
  //logger.debug(req.body.email);
  let user = await UserModel.findOne({
    //essaye de trouver dans la BD l'utilisateur
    email: req.body.email, // dont l'email correspond a l'email de la requete
    //FIXME: gerer le password
  });
  logger.debug(user);
  if (!user) {
    logger.error("login attempt failed", { requestBody: req.body });
    res.status(400).json({ message: "Error. Wrong email or password" });
  }
  const token = jwt.sign(
    {
      email: user.email, //payload du jwt
    },
    process.env.JWT_SECRET,
    { expiresIn: "5 hours" } //pas besoin de se loger pendant 5 h (duree de validite du token)
  );
  res.json({ access_token: token }); //renvoi le token au front
});

router.delete("/user-flush", async (req, res) => {
  //FIXME: debug function to remove before prod
  const result = await UserModel.deleteMany({}); //selectionne toute la selection des users en BD
  logger.info(result);
  res.json({ ok: true });
});

module.exports = router;
