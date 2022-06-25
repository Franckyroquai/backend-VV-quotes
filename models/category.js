var { DataTypes } = require("sequelize");
var sequelizeInstance =
  require("../services/db-connection").getSequelizeInstance();

var Category = sequelizeInstance.define("category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { CategoryModel: Category };
