var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();

var Quote = sequelizeInstance.define(
  "quote",
  {
    text: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = { QuoteModel: Quote };
