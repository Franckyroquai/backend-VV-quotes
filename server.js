const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const UserModel = require('./models/model');

const port = 3000;

// mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt', { useMongoClient: true });
const username = "Jarvis";
const password = "2A2USguNypnOeBVZ";
const cluster = "cluster0.7pf4a";
const dbname = "myFirstDatabase";
mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
    {}
  );
mongoose.connection.on('error', error => console.log(error) );
// mongoose.Promise = global.Promise;

// fin des configs et de la connection a la DB


require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes); // '/' >>> root ou racine

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

// Handle errors.
app.use(function(err, req, res, next) {
    console.log("erreur", err);
  res.status(err.status || 500);
  res.json({ error: err }); // mouais pas trop secure
//   res.json({ error: "il y a eu une erreur dans le serveur" }); // mieux
});

app.listen(port, () => {
  console.log(`Server started on port ${port}.`)
});
