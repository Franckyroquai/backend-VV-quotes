var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { UserModel } = require("../../../models/user");

var casual = require("casual");

module.exports = router.delete("/", async (req, res) => {
  try {
    var result = await UserModel.destroy({ where: {} });
    res.status(200).json({ entity: "user", deletedNumber: result });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
