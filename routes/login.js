let express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator")
const User = require("../models/User");
const passport = require("passport");

const passportAuth =

    router.get("/", (req, res) => {
        res.render("login");
    })
router.post("/", async (req, res, next) => {
    await check("email", "email is inValid").isEmail().notEmpty().run(req);
    await check("password", "Password must be at least 6 characters").isLength({ min: 6 }).run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.render("login", { errors: errors.array() })
    }

    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureMessage: true,
    })(req, res, next)



})
module.exports = router;