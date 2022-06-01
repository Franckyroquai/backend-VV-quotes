var router = require("express").Router();
var logger = require("../../../helpers/logger");
var { AuthorModel } = require("../../../models/author");

module.exports = router.post("/", async (req, res) => {
  try {
    var authorList = await AuthorModel.findAll({});
    res.status(200).json({ authorList }); //FIXME: interface contract
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
