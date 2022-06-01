const { Authentication, Authorization } = require("../middlewares/index");

const userRouter = require("express").Router();
const authorRouter = require("express").Router();

const userGenerate = require("./user/dev/generate");
const userFlush = require("./user/dev/flush");
const usersRegenerate = require("./user/dev/regenerate");
const AuthorGenerate = require("./author/dev/generate");
const AuthorMockOne = require("./author/dev/mock-one");

userRouter.use(
  "/user/generate",
  [Authentication() /*, Authorization*/],
  userGenerate
);
userRouter.use("/user/flush", userFlush);
userRouter.use("/user/regenerate", usersRegenerate);
authorRouter.use(
  "/author/generate",
  [Authentication(), Authorization],
  AuthorGenerate
);
authorRouter.use(
  "/author/mock-one",
  [Authentication(), Authorization],
  AuthorMockOne
);

module.exports = { userRouter, authorRouter };
