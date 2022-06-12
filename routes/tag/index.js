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
// const userGetFromComment = require("./public/get-from-comment");
// const userLogin = require("./public/login");
// const userRegister = require("./public/register");

// router.use("/from-comments", userGetFromComment);
// router.use("/login", userLogin);
// router.use("/register", userRegister);

//Privates
const getAll = require("./private/all");
const tagCreate = require("./private/create");
// const userDelete = require("./private/delete");
// const userGetByEmail = require("./private/get-by-email");
// const userGetById = require("./private/get-by-id");
// const userUpdate = require("./private/update");
// const userUpdateAuthorization = require("./private/update-authorization");

// router.use("/all", [Authentication(), Authorization], getAll);
router.use("/create", [Authentication(), Authorization], tagCreate);
// router.use("/delete", [Authentication(), Authorization], userDelete);
// router.use("/email", [Authentication(), Authorization], userGetByEmail);
// router.use("/id", [Authentication(), Authorization], userGetById);
// router.use("/update", [Authentication(), Authorization], userUpdate);

module.exports = { tagRouter: router, tagDevRouter: devRouter };
