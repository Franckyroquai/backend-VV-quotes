const router = require("express").Router();
const devRouter = require("express").Router();
const { Authentication, Authorization } = require("../../middlewares/index");
const logger = require("../../helpers/logger");

if (process.env.NODE_ENV === "dev") {
  const userFlush = require("./dev/flush");
  const userRegenerate = require("./dev/regenerate");
  const userGenerate = require("./dev/generate");

  devRouter.use("/flush", [Authentication(), Authorization], userFlush);
  devRouter.use("/generate", [Authentication(), Authorization], userGenerate);
  devRouter.use("/regenerate", userRegenerate);
}

//Publics
const userGetFromComment = require("./public/get-from-comment");
const userLogin = require("./public/login");
const userRegister = require("./public/register");

router.use("/from-comments", userGetFromComment);
router.use("/login", userLogin);
router.use("/register", userRegister);

//Privates
const userCount = require("./private/count");
const userCreate = require("./private/create");
const userDelete = require("./private/delete");
const userGetByEmail = require("./private/get-by-email");
const userGetById = require("./private/get-by-id");
const userUpdate = require("./private/update");
const userUpdateAuthorization = require("./private/update-authorization");

router.use("/count", [Authentication(), Authorization], userCount);
router.use("/create", [Authentication(), Authorization], userCreate);
router.use("/delete", [Authentication(), Authorization], userDelete);
router.use("/email", [Authentication(), Authorization], userGetByEmail);
router.use("/id", [Authentication(), Authorization], userGetById);
router.use("/update", [Authentication(), Authorization], userUpdate);
router.use(
  "/authorization",
  [Authentication(), Authorization],
  userUpdateAuthorization
);

module.exports = { userRouter: router, userDevRouter: devRouter };
