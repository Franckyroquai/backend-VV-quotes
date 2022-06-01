var router = require("express").Router();
var logger = require("../../../helpers/logger");
var sequelizeInstance =
  require("../../../services/db-connection").getSequelizeInstance();
var Sequelize = require("sequelize");
var { UserModel } = require("../../../models/user");

module.exports = router.post("/regenerate", async (req, res) => {
  try {
    var result = await sequelizeInstance.query("SELECT * FROM `regenerate`", {
      type: Sequelize.QueryTypes.SELECT,
    });
    // logger.debug(result);
    var alreadyregisteredUsers = await UserModel.findAll({
      where: { email: [result[0].email, result[1].email] },
    });
    // logger.debug("from db user", alreadyregisteredUsers);
    if (alreadyregisteredUsers.length) {
      res
        .status(400)
        .json({ message: "at least one user is already Present in db" });
    } else {
      var defaultPasswords = false;
      const userMails = process.env.USER_MAILS.split(",");
      const userPasswords = process.env.REGENERATE_PASSWORDS.split(",");
      // logger.debug("data to regenerate", { userMails, userPasswords });
      if (userMails.length != userPasswords.length) {
        defaultPasswords = true;
      }
      var userArray = [];
      for (var idx = 0; idx < userMails.length; idx++) {
        userArray.push({
          email: userMails[idx],
          password: defaultPasswords
            ? process.env.DEFAULT_REGEN_PASSWORD
            : userPasswords[idx],
          type: "admin",
        });
      }
      result.forEach((element) => {
        Object.assign(element, { type: "admin" });
      });
      logger.debug("regenerate users array", result);
      var users = await UserModel.bulkCreate(result, {
        individualHooks: true,
      });
      var usersEmail = [];
      users.forEach((user) => usersEmail.push(user.email));
      // logger.debug({userMails});
      res.status(200).json({ ok: true, users: usersEmail });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
