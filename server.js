console.log(`

`);
require("dotenv").config();
var logger = require("./helpers/logger");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var { ErrorHandler } = require("./middlewares/index");
var CustomRouter = require("./routes/CustomRouterConstruction");

var BaseDb = require("./services/db-connection");
BaseDb.initDbConnection();
// require("./services/db-init");

var app = express();

var port = process.env.PORT || 3000;

app.use(cors()); //permet d'outrepasser une faille de sécurité en dev
app.use(bodyParser.urlencoded({ extended: false })); //rajoute .body sur l'objet request
app.use(express.json());

CustomRouter(app);

// Handle errors.
app.use(ErrorHandler);

app.listen(port, () => {
  logger.info(
    `NodeJs Server started listening for incoming connections on port ${port}.`
  );
});

// TODO: image model ? links to user, post, comment, author ??
