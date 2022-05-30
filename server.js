require("dotenv").config();
var logger = require("./helpers/logger");
var express = require("express");
var bodyParser = require("body-parser"); //rajoute .body sur l'objet request
var cors = require("cors"); //permet d'outrepasser une faille de sécurité en dev
var { ErrorHandler } = require("./middlewares/index");
var CustomRouter = require("./routes/index");

require("./services/db-connection");
require("./services/db-init");

var app = express();

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
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
