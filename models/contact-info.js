var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();
var logger = require("../helpers/logger");

var ContactInfo = sequelizeInstance.define(
  "contact-info",
  {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    comment: "Complementary infos about a user",
    underscored: true,
  }
);

module.exports = { ContactInfoModel: ContactInfo };
