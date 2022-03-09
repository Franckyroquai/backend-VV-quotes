// const express = require("express");
const logger = require("../helpers/logger");

module.exports = (err, req, res, next) => {
  if (err) {
    logger.error(err);
    res.status(500).send("internal error");
  }
};
