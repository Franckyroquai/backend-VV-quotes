var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { UserModel } = require("../../../models/user");

module.exports = router.delete("/", async (req, res) => {
  try {
    if (req.body.id && typeof req.body.id === "number") {
      var user = await UserModel.findOne({
        where: {
          id: req.body.id,
        },
      });
      if (user === null) {
        res.status(404).json({ message: "user not found" });
      } else {
        var deletedUser = await user.destroy({});
        res.status(200).json({ deletedUser });
      }
    } else {
      res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
