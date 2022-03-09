const logger = require("../helpers/logger");
const jwt = require("express-jwt");

module.exports.jwtMiddleware = function (opts) {
  logger.debug("<<-->>");
  const baseJwtConfig = {
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  };
  logger.debug(baseJwtConfig);
  if (opts) {
    return jwt(opts);
  }
  return jwt(baseJwtConfig);
};
