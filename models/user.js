const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const User = sequelize.define(
  "user",
  {
    // Model attributes are defined here
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    //TODO:insérer le champ "type"
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const hash = await bcrypt.hash(user.password, saltRounds);
        user.password = hash;
      },
    },
  }
);

User.prototype.validPassword = async (password) => {
  return await bcrypt.compare(password, this.password);
};

module.exports = {
  UserModel: User,
};
