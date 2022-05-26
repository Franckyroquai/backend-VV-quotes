// var logger = require("../helpers/logger");
var jwt = require("express-jwt");

module.exports.jwtMiddleware = function (opts) {
  var baseJwtConfig = {
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  };
  if (opts) {
    return jwt(opts);
  }
  return jwt(baseJwtConfig);
};
