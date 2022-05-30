var logger = require("../../../helpers/logger");

var router = require("express").Router();

var jwt = require("jsonwebtoken");

var bcrypt = require("bcrypt");

var { UserModel } = require("../../../models/user");

module.exports = router.post("/", async (req, res) => {
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
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
