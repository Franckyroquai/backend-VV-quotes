const express = require("express");
const { send } = require("express/lib/response");
const logger = require("../../helpers/logger");
const UserModel = require("../../models/user");
const router = express.Router();

router.get("/profile", (req, res) => {
  // logger.debug({ headers: req.headers, body: req.body });
  logger.debug({ user: req.user, query: req.query });
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.secret_token,
  });
});

router.delete("/delete", async (req, res) => {
  logger.debug("request for deleting user", req.body, req.headers);
  const deletedUser = {}; //await UserModel.deleteOne({ email: req.body.email });
  res.json(deletedUser);
});

module.exports = router;
