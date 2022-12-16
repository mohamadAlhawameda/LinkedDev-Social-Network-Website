let express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator")
const User = require("../models/User");
const passport = require("passport");

router.get("/", (req, res, next) => {
    req.logout((err) => {
        return next(err);
    })
    return res.redirect("/login")
})


module.exports = router;