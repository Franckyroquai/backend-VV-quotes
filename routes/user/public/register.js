var logger = require("../../../helpers/logger");

var router = require("express").Router();

var { UserModel } = require("../../../models/user");

module.exports = router.post("/", async (req, res) => {
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
