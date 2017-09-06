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



app.use('/api', routes);

app.use(routes);

app.listen(3000, function() {
  console.log("App is running on localhost:3000");
})
