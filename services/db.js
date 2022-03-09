//TODO: export her th logic for db connection and configuration
const mongoose = require("mongoose");
const logger = require("../helpers/logger");

const dbusername = process.env.DBUSER;
const dbpassword = process.env.DBPASS;
const dbcluster = process.env.DBCLUSTER;
const dbname = process.env.DBNAME;

mongoose.connect(
  `mongodb+srv://${dbusername}:${dbpassword}@${dbcluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {}
);
mongoose.connection.on("error", (error) => {
  logger.error("mongoose connectio error", error);
  process.exit;
});
mongoose.connection.on("connected", () => {
  logger.info("MongoDb via Mongoose is connected");
});
mongoose.connection.on("disconnected", (something) => {
  logger.info("mongoose disconected", something);
});
mongoose.Promise = global.Promise;
