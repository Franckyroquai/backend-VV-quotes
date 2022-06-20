var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Author = sequelizeInstance.define(
  "author",
  {
    name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      required: true,
      unique: true,
      validate: {
        notNull: {
          msg: "Name of the author is required",
        },
        notEmpty: {
          msg: "the name of the author can't be empty",
        },
      },
    },
    wikilink: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "https://en.wikipedia.org/wiki/Author",
      validate: {
        notEmpty: {
          msg: "the link can't be empty",
        },
      },
    },
  },
  {
    timestamps: true,
    comment: "Author of a quote",
    underscored: true,
  }
);

module.exports = {
  AuthorModel: Author,
};
