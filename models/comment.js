var { DataTypes } = require("sequelize");
var sequelize = require("../services/db-connection");
var logger = require("../helpers/logger");

var Comment = sequelize.define("comment", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  image: {
    //TODO: remove attribute because ambiguous
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
  //FIXME: pepo implement first.
  //TODO: userId Attributes with linking in db-init.js
  //TODO: maybe an image in another table ?
});

module.exports = { CommentModel: Comment };
