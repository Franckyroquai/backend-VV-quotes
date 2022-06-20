var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();

var Comment = sequelizeInstance.define(
  "comment",
  {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      required: true,
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
    comment: "Comment to a post",
    underscored: true,
  }
);

module.exports = { CommentModel: Comment };
