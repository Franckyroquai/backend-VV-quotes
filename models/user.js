var { DataTypes } = require("sequelize");
var bcrypt = require("bcrypt");
var sequelize = require("../services/db-connection");
var logger = require("../helpers/logger");
var saltRounds = parseInt(process.env.SALT_ROUNDS);

var User = sequelize.define(
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
        var hash = await bcrypt.hash(user.password, saltRounds);
        user.password = hash;
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          var hash = await bcrypt.hash(user.password, saltRounds);
          user.password = hash;
        }
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
