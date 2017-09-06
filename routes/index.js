const express  = require("express");
const router   = express.Router();
const models   = require("../models/index")
const passport = require('passport');

router.get("/", passport.authenticate('basic', {session: false}), function(req, res) {
  res.send("Hi");
});


module.exports = router;
