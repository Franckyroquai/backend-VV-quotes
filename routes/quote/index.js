const router = require("express").Router();
const devRouter = require("express").Router();
const { Authentication, Authorization } = require("../../middlewares/index");
const logger = require("../../helpers/logger");

if (process.env.NODE_ENV === "dev") {
  const quoteFlush = require("./dev/flush");
  const quoteGenerate = require("./dev/generate");

  devRouter.use("/flush", [Authentication(), Authorization], quoteFlush);
  devRouter.use("/generate", [Authentication(), Authorization], quoteGenerate);
}

//Publics
const quoteAll = require("./public/all");
const quoteCount = require("./public/count");
const quoteRandom = require("./public/get-random");

router.use("/all", quoteAll);
router.use("/count", quoteCount);
router.use("/random", quoteRandom);

//Privates
const quoteCreate = require("./private/create");
const quoteDelete = require("./private/delete");
const quoteUpdate = require("./private/update");

router.use("/create", [Authentication(), Authorization], quoteCreate);
router.use("/delete", [Authentication(), Authorization], quoteDelete);
router.use("/update", [Authentication(), Authorization], quoteUpdate);

module.exports = { quoteRouter: router, quoteDevRouter: devRouter };
