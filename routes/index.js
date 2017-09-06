const express  = require("express");
const router   = express.Router();
const models   = require("../models/index")
const passport = require('passport');
const BasicStrategy   = require('passport-http').BasicStrategy;

const users = {
  'joe': 'password'
};

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));


router.get("/", passport.authenticate('basic', {session: false}), function(req, res) {
  res.status(200).send("This is my api documentation. Yeah it's not much, but she's got it where it counts kid");
});


// √√ Create a new activity for me to track.√√√√√√√√
router.post("/activities", passport.authenticate('basic', {session: false}),function(req, res) {

  models.Activity.create({
    description: req.body.description,
    measure: req.body.measure
  })
  .then(function(data) {
    res.status(201).send(data)
  })
  .catch(function(err) {
    res.status(500).send(err)
  })

})

// √√√√√ Show a list of all activities I am tracking. √√√√√√√
router.get("/activities", passport.authenticate('basic', {session: false}), function(req, res) {
  models.Activity.findAll({})
  .then(function(data) {
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send("Data not found")
    }
  })
  .catch(function(err) {
    res.status(500).send(err);
  })
})

// √√√√√ Show information about one activity I am tracking, and give me the data I have recorded for that activity √√√√√√
router.get("/activities/:id", passport.authenticate('basic', {session: false}), function(req, res) {

  models.Activity.findOne({
    where: {id: req.params.id},
    include: [
    {model: models.Stat, as: 'Stats'}
  ]
  })
  .then(function(data) {
    res.status(200).send(data);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })

});

// √√√√√ Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data. √√√√√
router.put("/activities/:id", passport.authenticate('basic', {session: false}), function(req, res) {

  models.Activity.update({
    description: req.body.description,
    measure: req.body.measure
  }, {
    where: {
      id: req.params.id
    }
  })
  .then(function(data) {
    res.status(201).send(data);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })

});


// √√√ Delete one activity I am tracking. This should remove tracked data for that activity as well. √√√√
router.delete("/activities/:id", passport.authenticate('basic', {session: false}), function(req, res) {

  models.Stat.findAll({
    where: {actId: req.params.id}
  })
  .then(function(data) {
    models.Stat.destroy({
      where: {actId: req.params.id}
    })
    .then(function(data) {
      models.Activity.findAll({
        where: {id: req.params.id}
      })
      .then(function(data) {
        models.Activity.destroy({
          where: {id: req.params.id}
        })
        .then(function(data) {
          res.status(200).send(data);
        })
        .catch(function(err) {
          res.status(500).send(err);
        })
      })
      .catch(function(err) {
        res.status(500).send(err);
      })
    });
    })
    .catch(function(err) {
      res.status(500).send(err)
    });
  });


// √√√ Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded. √√√
router.post("/activities/:id/stats", passport.authenticate('basic', {session: false}), function(req, res) {

  models.Stat.create({
    actId: req.params.id,
    date: req.body.date,
    quantity: req.body.quantity
  })
  .then(function(data) {
    res.status(200).send(data);
  })
  .catch(function(err) {
    res.status(500).send(err);
  })

});

// √√ Remove tracked data for a day. √√
router.delete("/stats/:id", passport.authenticate('basic', {session: false}), function(req, res) {

  models.Stat.findOne({
    where: {id: req.params.id}
  })
  .then(function(data) {
    models.Stat.destroy({
      where: {id: req.params.id}
    })
    .then(function(data) {
      res.status(200).send(data);
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
  })
  .catch(function(err) {
    res.status(500).send(err);
  })
});


module.exports = router;
