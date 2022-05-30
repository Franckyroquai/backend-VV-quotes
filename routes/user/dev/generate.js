var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { UserModel } = require("../../../models/user");

var casual = require("casual");

module.exports = router.post("/", async (req, res) => {
  try {
    var generationQty = req.body.number || 1;
    var userType = req.body.type || "lambda";
    var userArray = [];
    for (var idx = 0; idx < generationQty; idx++) {
      userArray.push({
        email: casual.email,
        password: "debugUser",
        type: userType,
      });
    }
    logger.debug("users array", userArray);
    var users = await UserModel.bulkCreate(userArray, {
      individualHooks: true,
    });
    res.status(200).json({ ok: true, number: users.length });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
