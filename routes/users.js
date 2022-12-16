var express = require('express');
var router = express.Router();
const Users = require("../models/User");
/* GET users listing. */
router.get('/', function (req, res, next) {
  Users.find({}, (error, users) => {
    if (error) {
      res.end("Database Error");
    }
    else {
      res.render("users", { users: users });
    }
  })
});

module.exports = router;
