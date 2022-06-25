var logger = require("../helpers/logger");
const routeConfigs = require("../config/authorization.json");

module.exports = function (req, res, next) {
  if (req.user.type === "admin") {
    logger.debug("bypassing authorization middleware");
    next();
  } else {
    var splitUrl = req.originalUrl.substring(1).split("/");
    if (req.user) {
      var value;
      for (let i = 0; i < splitUrl.length; i++) {
        if (i === 0) {
          value = routeConfigs[`${splitUrl[i]}`];
        } else {
          value = value[`${splitUrl[i]}`];
        }
      }
      if (value.find((elem) => elem === req.user.type)) {
        logger.debug("authorization Middleware passed");
        next();
      } else {
        logger.debug("authorization Middleware blocked");
        res.status(403).json({ message: "forbidden" });
      }
    }
  }
};
