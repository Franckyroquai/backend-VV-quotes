const { DataTypes } = require("sequelize");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");

const Comment = sequelize.define(
  "comment",
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true,
      required: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  }
);

module.exports = { CommentModel: Comment };
