var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var Post = sequelizeInstance.define(
  "post",
  {
    // Model attributes are defined here
    content: {
      type: DataTypes.STRING(8000),
      allowNull: false,
      //TODO:vérifier unique: true;
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
      type: DataTypes.BIGINT,
      allowNull: false,
      // allowNull defaults to true
    },
    numberOfLikes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      // allowNull defaults to true
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

module.exports = { PostModel: Post };
