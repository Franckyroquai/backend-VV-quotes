const dotenv = require("dotenv").config();
if (dotenv.error) {
  console.error(dotenv.error);
  throw dotenv.error;
}
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

const UserModel = require("./models/user");

const port = process.env.SERVERPORT;

const dbusername = process.env.DBUSER;
const dbpassword = process.env.DBPASS;
const dbcluster = process.env.DBCLUSTER;
const dbname = process.env.DBNAME;

mongoose.connect(
  `mongodb+srv://${dbusername}:${dbpassword}@${dbcluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {}
);
mongoose.connection.on("error", (error) => console.error(error));
mongoose.Promise = global.Promise;

require("./authentification");

const publicAuthRoutes = require("./routes/user/public-routes");
const privateAuthRoutes = require("./routes/user/private-routes");
const publicQuoteRoutes = require("./routes/quote/public-routes");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", publicAuthRoutes); // '/' >>> root ou racine
app.use("/quote", publicQuoteRoutes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  privateAuthRoutes
);

// Handle errors.
app.use((err, req, res, next) => {
  console.error("erreur", err);
  res.status(err.status || 500);
  res.json({ error: err }); // mouais pas trop secure
  //   res.json({ error: "il y a eu une erreur dans le serveur" }); // mieux
});

app.listen(port, () => {
  console.info(`Server started on port ${port}.`);
});
