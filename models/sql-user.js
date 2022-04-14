const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../services/sql-db");
const logger = require("../helpers/logger");

const UserModel = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //TODO:vérifier unique: true;
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // allowNull defaults to true
    },
    //TODO:insérer le champ "type"
  },
  {
    // Other model options go here
  }
);

//TODO:fonction hachage de mot de passe; vérifier l'authentification du mot de passe

// `sequelize.define` also returns the model
logger.debug(
  "------------------------",
  UserModel === sequelize.models.User,
  "------------------------"
); // true

module.exports = { SQLUserModel: UserModel };
