const { DataTypes } = require("sequelize");
const sequelize = require("../services/db-connection");
const logger = require("../helpers/logger");

const Post = sequelize.define(
  "post",
  {
    // Model attributes are defined here
    text: {
      type: DataTypes.STRING(8000),
      allowNull: false,
      //TODO:vérifier unique: true;
    },
    Titre: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    PostAuthor: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    Reference: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    Link: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    Image: {
      type: DataTypes.BLOB,
      allowNull: false,
      // allowNull defaults to true
    },
    NumberOfViews: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    NumberOfLikes: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    // email: {
    //   //A Garder ou à conserver dans users ???
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    // },

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
