var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator")
const User = require("../models/User");
const gravatar = require("gravatar")
const bcrypt = require("bcrypt")



router.get('/', function (req, res, next) {
    res.render("signup")
});
router.post("/", async (req, res) => {
    // check validation
    await check("email", "email is inValid").isEmail().notEmpty().run(req);
    await check("password", "Password must be at least 6 characters").isLength({ min: 6 }).run(req)
    await check("confirmPassword", "Password and confirm password do not match").matches(req.body.password).run(req)
    const errors = validationResult(req);
    // if there is a validation error then render it to the user
    if (!errors.isEmpty()) {
        return res.render("signup", { errors: errors.array() })
    }
    const { name, email, password, position, company, learning, expert, twitter, linkedin, website } = req.body;

    User.find({ email: email }, (err, user) => {
        if (err) {
            console.log(err)
            return
        }
        // check if the user exists in the database
        if (user.length >= 1) {
            let errorObj = { msg: "Email already exists" }
            return res.render("signup", { errors: [errorObj] })
        }
        // doing encryption to the password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hashed_password) => {
                if (err) {
                    console.log(err)
                    return
                }
                // create a new user
                let newUser = new User();

                newUser.name = name;
                newUser.email = email;
                const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'retro' }, true)
                newUser.image = avatar;
                newUser.password = hashed_password;
                newUser.position = position;
                newUser.company = company;
                newUser.learning = learning.split(",");
                newUser.expert = expert.split(",");
                if (twitter) newUser.socialMedia.twitter = `https://twitter.com/${twitter}`;
                if (linkedin) newUser.socialMedia.linkedin = linkedin || "";
                if (website) newUser.socialMedia.website = website || ""
                newUser.save((err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect("/login")
                    }
                })
            })
        })

    })

})

module.exports = router;
