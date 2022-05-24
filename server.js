require("dotenv").config();
const logger = require("./helpers/logger");
const express = require("express");
const bodyParser = require("body-parser"); //rajoute .body sur l'objet request
const cors = require("cors"); //permet d'outrepasser une faille de sécurité en dev
const errorHandler = require("./middlewares/errorHandler");
const { jwtMiddleware } = require("./middlewares/authentication");

require("./services/db-connection");
require("./services/db-init");

const app = express();

const port = process.env.PORT || 3000;

const publicAuthRoutes = require("./routes/user/public");
const privateAuthRoutes = require("./routes/user/private");
const publicQuoteRoutes = require("./routes/quote/public");
const privateQuoteRoutes = require("./routes/quote/private");
const publicAuthorRoutes = require("./routes/author/public");
const privateAuthorRoutes = require("./routes/author/private");
const publicPostRoutes = require("./routes/post/public");
const privatePostRoutes = require("./routes/post/private");
const publicCommentRoutes = require("./routes/comment/private");
const privateCommentRoutes = require("./routes/comment/private");
const publicCategoryRoutes = require("./routes/category/public");
const privateCategoryRoutes = require("./routes/category/private");
const privateContactInfoRoutes = require("./routes/contact-info/private");

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
app.use("./contact-info", jwtMiddleware(), privateContactInfoRoutes);

// Handle errors.
app.use(errorHandler);

app.listen(port, () => {
  logger.info(
    `NodeJs Server started listening for incoming connections on port ${port}.`
  );
});
