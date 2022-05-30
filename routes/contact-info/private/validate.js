var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { ContactInfoModel } = require("../../../models/contact-info");

module.exports = router.post("/validate", async (req, res) => {
  try {
    res.send("todo"); //TODO: to implement for pepo
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
