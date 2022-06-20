const router = require("express").Router();
const devRouter = require("express").Router();
const { Authentication, Authorization } = require("../../middlewares/index");
const logger = require("../../helpers/logger");

if (process.env.NODE_ENV === "dev") {
  const generate = require("./dev/generate");
  const generateAssoc = require("./dev/generateAssoc");
  const flush = require("./dev/flush");
  const flushAssoc = require("./dev/flushAssoc");

  devRouter.use("/generate", [Authentication(), Authorization], generate);
  devRouter.use(
    "/generate-assoc",
    [Authentication(), Authorization],
    generateAssoc
  );
  devRouter.use("/flush", [Authentication(), Authorization], flush);
  devRouter.use("/flush-assoc", [Authentication(), Authorization], flushAssoc);
}

//Publics

//Privates
const getAll = require("./private/all");
const tagCreate = require("./private/create");
const tagAssociate = require("./private/associate");
const tagDissociate = require("./private/dissociate");
const getAssoc = require("./private/associatedPosts");
const tagDelete = require("./private/delete");
const tagUpdate = require("./private/update");
const tagValidate = require("./private/validate");

router.use("/all", [Authentication(), Authorization], getAll);
router.use("/create", [Authentication(), Authorization], tagCreate);
router.use("/associate", [Authentication(), Authorization], tagAssociate);
router.use("/dissociate", [Authentication(), Authorization], tagDissociate);
router.use("/associated", [Authentication(), Authorization], getAssoc);
router.use("/delete", [Authentication(), Authorization], tagDelete);
router.use("/update", [Authentication(), Authorization], tagUpdate);
router.use("/validate", [Authentication(), Authorization], tagValidate);

module.exports = { tagRouter: router, tagDevRouter: devRouter };
