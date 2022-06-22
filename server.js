require("dotenv").config();
var logger = require("./helpers/logger");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var { ErrorHandler } = require("./middlewares/index");
var CustomRouter = require("./routes/CustomRouterConstruction");
var expressListEndpoints = require("express-list-endpoints");

var BaseDb = require("./services/db-connection");
BaseDb.initDbConnection();
require("./services/models-relations");

var app = express();

var port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false })); //rajoute .body sur l'objet request
app.use(express.json());
CustomRouter(app);
app.use(ErrorHandler);

app.listen(port, () => {
  logger.info(
    `NodeJs Server started listening for incoming connections on port ${port}.`
  );
  logger.debug(expressListEndpoints(app)); //remove package when router is finished
});
