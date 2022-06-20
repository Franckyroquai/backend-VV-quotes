var router = require("express").Router();
var logger = require("../../../helpers/logger");

var { getSequelizeInstance } = require("../../../services/db-connection");
var Sequelize = require("sequelize");

module.exports = router.delete("/", async (req, res) => {
  try {
    var sequInst = getSequelizeInstance();
    var numberOfDeletedItems = await sequInst.query("DELETE FROM `post_tag`", {
      type: Sequelize.QueryTypes.DELETE,
    });
    res.json({ entity: "tag", deletedNumber: numberOfDeletedItems });
  } catch (error) {
    logger.error("uncaught error", error); //FIXME: error handling
    res.status(500).json({ message: "internal server error" });
  }
});
