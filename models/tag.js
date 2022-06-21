var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Tag = sequelizeInstance.define(
  "tag",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
    comment: "Posts tags",
    underscored: true,
  }
);

module.exports = { TagModel: Tag };
