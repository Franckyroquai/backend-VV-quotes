// var logger = require("../helpers/logger");

function errorHandler(err, req, res, next) {
  if (err) {
    let status = 500;
    let msg = "internal error";
    if (err.status) {
      status = err.status;
    }
    if (err.code) {
      msg = err.code;
    }
    res.status(status).send(msg);
  }
}

// TODO: this is a basic template need to be developed into real middleware
// who catches all kinds of errors (sequelize, native javascript and custom ones)

module.exports = errorHandler;
