const { Authentication, Authorization } = require("../middlewares/index");

const devroutes = function (expressAppForDev) {
  const userGenerate = require("./user/dev/generate");
  const userFlush = require("./user/dev/flush");
  const usersRegenerate = require("./user/dev/regenerate");
  const AuthorGenerate = require("./author/dev/generate");

  expressAppForDev.use(
    "/dev/user/generate",
    [Authentication() /*, Authorization*/],
    userGenerate
  );
  expressAppForDev.use("/dev/user/flush", userFlush);
  expressAppForDev.use("/dev/user/regenerate", usersRegenerate);
  expressAppForDev.use(
    "/dev/author/generate",
    [Authentication(), Authorization],
    AuthorGenerate
  );
};

module.exports = function Megarouter(expressApp) {
  const register = require("./user/public/register");
  const login = require("./user/public/login");
  const countUsers = require("./user/private/count");
  // publics
  expressApp.use("/register", register);
  expressApp.use("/login", login);

  //privates
  expressApp.use("/user/count", [Authentication(), Authorization], countUsers);

  if (process.env.NODE_ENV === "dev") {
    devroutes(expressApp);
  }
};
