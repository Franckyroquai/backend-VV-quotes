var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Image = sequelizeInstance.define("image", {
  payload: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extension: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
// TODO: belongsTo: [author, user, post, comment, client] loosely, at least one;
module.exports = { ImageModel: Image };
