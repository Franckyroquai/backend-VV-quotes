var { DataTypes } = require("sequelize");
var bcrypt = require("bcrypt");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var saltRounds = parseInt(process.env.SALT_ROUNDS);

var User = sequelizeInstance.define(
  "user",
  {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    type: {
      type: DataTypes.TEXT("tiny"), //TODO: ENUM pepo
      allowNull: false,
      isIn: [["admin", "lambda", "omega"]],
      // defaultValue: "lambda",
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
