var express = require("express");
var logger = require("../../helpers/logger");
var { UserModel } = require("../../models/user");
var router = express.Router();

function verifyUserInfos(userObject) {
  if (userObject && typeof userObject === "object") {
    if (userObject.email && userObject.password && userObject.type) {
      return true;
    }
  }
  return false;
}

router.post("/create-one", async (req, res) => {
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
  } catch (err) {
    logger.error("erreur de user/create-one"); //TODO: finir gestion erreurs asynchrones
  }
});

router.post("/update", async (req, res) => {
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
    logger.debug("user not updated");
    res.status(500).json({ message: "server error" });
  }
});

router.post("/find/id", async (req, res) => {
  try {
    var user = await UserModel.findOne({ where: { id: req.body.id } });
    res.status(200).json(user);
  } catch (err) {
    logger.error("error get user by id");
    res.status(500).json({ message: "server error" });
  }
});

router.post("/find/email", async (req, res) => {
  try {
    var user = await UserModel.findOne({ where: { email: req.body.email } });
    res.status(200).json(user);
  } catch (err) {
    logger.error("error get user by email");
    logger.debug(err);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/authorization", async (req, res) => {
  res.send("todo"); //TODO: to implement for pepo
});

router.delete("/delete", async (req, res) => {
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
    logger.debug(error);
    logger.error({ message: "server error" });
    res.status(500).json({ message: "server error" });
  }
});

router.get("/count", async (req, res) => {
  try {
    var userCount = await UserModel.count();
    res.status(200).json({ count: userCount });
  } catch (error) {
    logger.debug({ message: "server error" });
    res.status(500).send("debug");
  }
});

module.exports = router;
