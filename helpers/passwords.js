const bcrypt = require("bcrypt");
const logger = require("./logger");
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const salt = process.env.PASSWORD_SALT;

logger.debug(saltRounds, typeof saltRounds);

if (!salt || !saltRounds) {
  logger.error("no salt please use pepper instead");
  process.exit;
}

async function cryptPassword(password) {
  return bcrypt.hash(password, saltRounds);
}

async function validatePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
module.exports = { cryptPassword, validatePassword };
