const express         = require("express");
const bodyParser      = require("body-parser");
const path            = require("path");
const routes          = require("./routes/index");
const passport        = require('passport');
const BasicStrategy   = require('passport-http').BasicStrategy;
const morgan          = require("morgan");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));

app.use(routes);

app.listen(3000, function() {
  console.log("App is running on localhost:3000");
})
