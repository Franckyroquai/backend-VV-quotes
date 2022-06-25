var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { UserModel } = require("../../../models/user");

function checkRole(role) {
  const possibleRoles = process.env.ROLES.split(",");
  logger.warn("logic un-implemented");
  return true; //TODO: to implement with env or config file
}

module.exports = router.post("/", async (req, res) => {
  try {
    var id = parseInt(req.body.id);
    var newRole = req.body.role;
    if (id && newRole && typeof id === "number" && checkRole(newRole)) {
      var user = await UserModel.findOne({ where: { id } });
      var result = await user.update({ type: req.body.role });
      res.json({ result });
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
