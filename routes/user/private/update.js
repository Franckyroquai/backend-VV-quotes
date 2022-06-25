var router = require("express").Router();
var logger = require("../../../helpers/logger");
const { checkIfId } = require("../../../helpers/math");
var { UserModel } = require("../../../models/user");

function sanitizer(request) {
  if (checkIfId(request.body.id)) {
    if (request.body.email && typeof request.body.email != "string") {
      logger.debug("bad email");
      return false;
    }
    if (
      request.body.password &&
      (typeof request.body.password != "string" ||
        request.body.password.length < 6)
    ) {
      logger.debug("bad password");
      return false;
    }
    return true;
  } else {
    logger.debug("bad else");

    return false;
  }
}

function checkUserRights(request) {
  var userIdToModify = request.body.id;
  var requestUser = request.user;
  if (requestUser.type === "admin" || userIdToModify === requestUser.id) {
    return true;
  }
  return false;
}

module.exports = router.post("/", async (req, res) => {
  try {
    if (sanitizer(req) && checkUserRights(req)) {
      var user = await UserModel.findOne({
        where: { id: req.body.id },
      });
      var updatedUser = await user.update({
        email: req.body.email,
        password: req.body.password,
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
