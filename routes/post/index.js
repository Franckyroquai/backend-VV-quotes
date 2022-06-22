const router = require("express").Router();
const devRouter = require("express").Router();
const { Authentication, Authorization } = require("../../middlewares/index");
const logger = require("../../helpers/logger");

if (process.env.NODE_ENV === "dev") {
  const Flush = require("./dev/flush");
  const Generate = require("./dev/generate");

  devRouter.use("/flush", [Authentication(), Authorization], Flush);
  devRouter.use("/generate", [Authentication(), Authorization], Generate);
}

//Publics
const getAll = require("./public/all");

router.use("/all", getAll);

//Privates
const postCreate = require("./private/create");
const postDelete = require("./private/delete");
const postUpdate = require("./private/update");
const postValidate = require("./private/validate");
const postLinkCategory = require("./private/link-category");
const postUnlinkCategory = require("./private/unlink-category");

router.use("/create", [Authentication(), Authorization], postCreate);
router.use("/delete", [Authentication(), Authorization], postDelete);
router.use("/update", [Authentication(), Authorization], postUpdate);
router.use("/validate", [Authentication(), Authorization], postValidate);
router.use(
  "/link-category",
  [Authentication(), Authorization],
  postLinkCategory
);
router.use(
  "/unlink-category",
  [Authentication(), Authorization],
  postUnlinkCategory
);

module.exports = { postRouter: router, postDevRouter: devRouter };
