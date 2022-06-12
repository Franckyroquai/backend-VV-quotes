var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Comment = sequelizeInstance.define("comment", {
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
  //FIXME: pepo implement first.
  //TODO: userId Attributes with linking in db-init.js
  //TODO: maybe an image in another table ?
});

module.exports = { CommentModel: Comment };
