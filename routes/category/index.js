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
const categoryCreate = require("./private/create");
const categoryDelete = require("./private/delete");
const categoryUpdate = require("./private/update");

router.use("/create", [Authentication(), Authorization], categoryCreate);
router.use("/delete", [Authentication(), Authorization], categoryDelete);
router.use("/update", [Authentication(), Authorization], categoryUpdate);

module.exports = { categoryRouter: router, categoryDevRouter: devRouter };
