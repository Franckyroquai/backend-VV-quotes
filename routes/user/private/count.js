var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { UserModel } = require("../../../models/user");

module.exports = router.get("/", async (req, res) => {
  try {
    var userCount = await UserModel.count();
    res.status(200).json({ count: userCount });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});