// var { Sequelize } = require("sequelize");
// var logger = require("../helpers/logger");

// var sequelizeInstance = new Sequelize(
//   process.env.DBNAME,
//   process.env.DBUSER,
//   process.env.DBPASS,
//   {
//     host: process.env.DBHOST,
//     port: parseInt(process.env.DBPORT, 10),
//     dialect: "mysql",
//     logging: false,
//     showWarnings: false,
//     define: {
//       charset: "utf8mb4",
//       collate: "utf8mb4_0900_ai_ci",
//     },
//   }
// );

// async function connection() {
//   try {
//     await sequelizeInstance.authenticate();
//     logger.info("Mysql database connection has been established successfully.");
//   } catch (error) {
//     logger.error("Unable to connect to the sql database:", error);
//   }
// }

// function getSequelizeInstance() {
//   return sequelizeInstance;
// }

// // const { MongoClient, ServerApiVersion } = require('mongodb');
// // const uri = `mongodb+srv://${process.env.MONGO_USER}:<${process.env.MONGO_PASS}>@free-test.xjisepv.mongodb.net/?retryWrites=true&w=majority`;
// // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// // client.connect(err => {
// //   const collection = client.db("test").collection("devices");
// //   // perform actions on the collection object
// //   client.close();
// // });

// module.exports = { getSequelizeInstance, initDbConnection: connection };

const mongoose = require("mongoose");
const logger = require("../helpers/logger");

const dbUserName = process.env.DBUSER;
const dbPassword = process.env.DBPASS;
const dbCluster = process.env.DBCLUSTER;
const dbName = process.env.DBNAME;

mongoose.connect(
  `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  {}
);
mongoose.connection.on("error", (error) => {
  logger.error("mongoose connection error", error);
  process.exit;
});
mongoose.connection.on("connected", () => {
  logger.info("MongoDb via Mongoose is connected");
});
mongoose.connection.on("disconnected", (reason) => {
  logger.info("mongoose disconnected", reason);
});

mongoose.Promise = global.Promise; //promesses mongoose mêmes promesses que le reste du systeme (async await)
