// var express = require("express");
var logger = require("../helpers/logger");

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

module.exports = errorHandler;
