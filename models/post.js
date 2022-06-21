var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Post = sequelizeInstance.define(
  "post",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberOfViews: {
      type: DataTypes.BIGINT, //TODO: move to it's own entity
      allowNull: false,
    },
    numberOfLikes: {
      type: DataTypes.BIGINT, //TODO: move to it's own entity
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
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
    comment: "Blog Posts",
    underscored: true,
  }
);

module.exports = { PostModel: Post };
