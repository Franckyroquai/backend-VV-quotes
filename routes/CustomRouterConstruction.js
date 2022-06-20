const router = require("express").Router();
const { userRouter, userDevRouter } = require("./user/index");
const { quoteRouter, quoteDevRouter } = require("./quote/index");
const { postRouter, postDevRouter } = require("./post/index");
const { commentRouter, commentDevRouter } = require("./comment/index");
const { authorRouter, authorDevRouter } = require("./author/index");
const { tagRouter, tagDevRouter } = require("./tag/index");

const {
  contactInfoRouter,
  contactInfoDevRouter,
} = require("./contact-info/index");

const logger = require("../helpers/logger");

module.exports = function (app) {
  if (process.env.NODE_ENV === "dev") {
    router.use("/dev/user", userDevRouter);
    router.use("/dev/quote", quoteDevRouter);
    router.use("/dev/post", postDevRouter);
    router.use("/dev/contact-info", contactInfoDevRouter);
    router.use("/dev/comment", commentDevRouter);
    router.use("/dev/author", authorDevRouter);
    router.use("/dev/tag", tagDevRouter);
  }

  router.use("/user", userRouter);
  router.use("/quote", quoteRouter);
  router.use("/post", postRouter);
  router.use("/contact-info", contactInfoRouter);
  router.use("/comment", commentRouter);
  router.use("/author", authorRouter);
  router.use("/tag", tagRouter);
  app.use(router);
};
