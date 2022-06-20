const router = require("express").Router();
const devRouter = require("express").Router();
const { Authentication, Authorization } = require("../../middlewares/index");
const logger = require("../../helpers/logger");

if (process.env.NODE_ENV === "dev") {
  const flush = require("./dev/flush");
  const generate = require("./dev/generate");
  const mockOne = require("./dev/mock-one");

  devRouter.use("/flush", [Authentication(), Authorization], flush);
  devRouter.use("/generate", [Authentication(), Authorization], generate);
  devRouter.use("/mock-one", [Authentication(), Authorization], mockOne);
}

//Privates
const getAll = require("./private/all");
const authorCreate = require("./private/create");
const authorDelete = require("./private/delete");
const authorUpdate = require("./private/update");
const authorFromQuote = require("./private/from-quote");
const authorGetOne = require("./private/one");

router.use("/all", [Authentication(), Authorization], getAll);
router.use("/create", [Authentication(), Authorization], authorCreate);
router.use("/delete", [Authentication(), Authorization], authorDelete);
router.use("/update", [Authentication(), Authorization], authorUpdate);
router.use("/from-quote", [Authentication(), Authorization], authorFromQuote);
router.use("/one", [Authentication(), Authorization], authorGetOne);

module.exports = { authorRouter: router, authorDevRouter: devRouter };
