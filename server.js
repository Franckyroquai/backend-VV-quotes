require("dotenv").config();
var logger = require("./helpers/logger");
var express = require("express");
var bodyParser = require("body-parser"); //rajoute .body sur l'objet request
var cors = require("cors"); //permet d'outrepasser une faille de sécurité en dev
var errorHandler = require("./middlewares/errorHandler");
var { jwtMiddleware } = require("./middlewares/authentication");

require("./services/db-connection");
require("./services/db-init");

var app = express();

var port = process.env.PORT || 3000;

var publicAuthRoutes = require("./routes/user/public");
var privateAuthRoutes = require("./routes/user/private");
var publicQuoteRoutes = require("./routes/quote/public");
var privateQuoteRoutes = require("./routes/quote/private");
var publicAuthorRoutes = require("./routes/author/public");
var privateAuthorRoutes = require("./routes/author/private");
var publicPostRoutes = require("./routes/post/public");
var privatePostRoutes = require("./routes/post/private");
var publicCommentRoutes = require("./routes/comment/public");
var privateCommentRoutes = require("./routes/comment/private");
var publicCategoryRoutes = require("./routes/category/public");
var privateCategoryRoutes = require("./routes/category/private");
var privateContactInfoRoutes = require("./routes/contact-info/private");

app.use(cors()); //app.use (express maintenant tu utilises...) => definit les middleware dans l'ordre à utiliser

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", publicAuthRoutes); // '/' >>> root ou racine
app.use("/user", jwtMiddleware(), privateAuthRoutes);
app.use("/quote", publicQuoteRoutes);
app.use("/quote", jwtMiddleware(), privateQuoteRoutes);
app.use("/author", publicAuthorRoutes);
app.use("/author", jwtMiddleware(), privateAuthorRoutes);
app.use("/post", publicPostRoutes);
app.use("/post", jwtMiddleware(), privatePostRoutes);
app.use("/comment", publicCommentRoutes);
app.use("/comment", jwtMiddleware(), privateCommentRoutes);
app.use("/category", publicCategoryRoutes);
app.use("/category", jwtMiddleware(), privateCategoryRoutes);
app.use("/contact-info", jwtMiddleware(), privateContactInfoRoutes);

// Handle errors.
app.use(errorHandler);

app.listen(port, () => {
  logger.info(
    `NodeJs Server started listening for incoming connections on port ${port}.`
  );
});

// TODO: image model ? links to user, post, comment, author ??
