var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { UserModel } = require("../../../models/user");

function verifyUserInfos(userObject) {
  if (userObject && typeof userObject === "object") {
    if (userObject.email && userObject.password && userObject.type) {
      return true;
    }
  }
  return false;
}

module.exports = router.post("/", async (req, res) => {
  try {
    if (verifyUserInfos(req.body) && req.body.id) {
      var user = await UserModel.findOne({
        where: { id: req.body.id },
      });
      var updatedUser = await user.update({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type,
      });
      res.status(200).json({ user: updatedUser, message: "updated" });
    } else {
      logger.debug("bad request");
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
