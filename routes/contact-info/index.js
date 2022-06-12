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

//Privates
const contactInfoCreate = require("./private/create");
const contactInfoDelete = require("./private/delete");
const contactInfoUpdate = require("./private/update");
const contactInfoValidate = require("./private/validate");

router.use("/create", [Authentication(), Authorization], contactInfoCreate);
router.use("/delete", [Authentication(), Authorization], contactInfoDelete);
router.use("/update", [Authentication(), Authorization], contactInfoUpdate);
router.use("/validate", [Authentication(), Authorization], contactInfoValidate);

module.exports = { contactInfoRouter: router, contactInfoDevRouter: devRouter };
