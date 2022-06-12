const router = require("express").Router();
const devRouter = require("express").Router();
const { Authentication, Authorization } = require("../../middlewares/index");
const logger = require("../../helpers/logger");

if (process.env.NODE_ENV === "dev") {
  const generate = require("./dev/generate");
  const flush = require("./dev/flush");

  devRouter.use("/generate", [Authentication(), Authorization], generate);
  devRouter.use("/flush", [Authentication(), Authorization], flush);
}

//Publics

const getAll = require("./public/all");

router.use("/all", getAll);

//Privates
const commentCreate = require("./private/create");
const commentDelete = require("./private/delete");
const commentUpdate = require("./private/update");
const commentValidate = require("./private/validate");

router.use("/create", [Authentication(), Authorization], commentCreate);
router.use("/delete", [Authentication(), Authorization], commentDelete);
router.use("/update", [Authentication(), Authorization], commentUpdate);
router.use("/validate", [Authentication(), Authorization], commentValidate);

module.exports = { commentRouter: router, commentDevRouter: devRouter };
