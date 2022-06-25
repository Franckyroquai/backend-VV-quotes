var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { UserModel } = require("../../../models/user");

module.exports = router.get("/", async (req, res) => {
  try {
    var user = await UserModel.findOne({ where: { email: req.body.email } });
    res.status(200).json(user);
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
