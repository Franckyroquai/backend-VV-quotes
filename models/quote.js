var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();

var Quote = sequelizeInstance.define(
  "quote",
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    locutor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    locutorLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    comment: "quotes",
    underscored: true,
  }
);

module.exports = { QuoteModel: Quote };
