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
    if (verifyUserInfos(req.body)) {
      var user = await UserModel.create({
        email: req.body.email,
        password: req.body.password,
        type: req.body.type,
      });
    } else {
      res.status(400).json({ message: "bad request" });
    }
    logger.debug("user created", { email: user.email, type: user.type });
    res.status(200).json({ message: `user created`, email: user.email });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
