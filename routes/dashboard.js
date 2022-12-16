var express = require('express');
var router = express.Router();
const Users = require("../models/User");
const md5 = require("md5");
const auth = require('../config/auth');

//Going to have a Is authenticated function here 

router.get('/', auth, function (req, res, next) {

  Users.find({ expert: { $in: req.user.learning } }, function (error, expertUsers) {
    if (error) {
      throw error;
    }

    Users.find({ learning: { $in: req.user.expert } }, function (error, learningUsers) {
      if (error) {
        throw error;
      }
      res.render("dashboard", { userExperts: expertUsers.slice(0, 5), helpUsers: learningUsers.slice(0, 5) })

    })
  })

});



module.exports = router;

