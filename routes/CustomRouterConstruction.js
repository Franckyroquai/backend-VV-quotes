const { Authentication, Authorization } = require("../middlewares/index");
const router = require("express").Router();
const userRouter = require("express").Router();
const authorRouter = require("express").Router();

const userGenerate = require("./user/dev/generate");
const userFlush = require("./user/dev/flush");
const usersRegenerate = require("./user/dev/regenerate");
const AuthorGenerate = require("./author/dev/generate");
const AuthorMockOne = require("./author/dev/mock-one");

userRouter.use("/user", [Authentication(), Authorization], userGenerate);
userRouter.use("/user", [Authentication(), Authorization], userFlush);
userRouter.use("/user", usersRegenerate);
authorRouter.use("/author/generate", AuthorGenerate);
authorRouter.use("/author/mock-one", [Authorization], AuthorMockOne);

module.exports = function (app) {
  router.use("/dev", userRouter);
  router.use("/dev", [Authentication()], authorRouter);
  app.use(router);

  // const register = require("./user/public/register");
  const login = require("./user/public/login");
  // const countUsers = require("./user/private/count");
  // const authorAll = require("./author/private/all");
  // const authorCreate = require("./author/private/create");

  //logger.bob(truc.machin)
  // // publics
  // app.use("/register", register);
  app.use("/login", login);

  // //privates
  // app.use("/user/count", [Authentication(), Authorization], countUsers);
  // app.use("/author/private/all", [Authentication(), Authorization], authorAll);
  // app.use(
  //   "/author/private/create",
  //   [Authentication(), Authorization],
  //   authorCreate
  // );
};
