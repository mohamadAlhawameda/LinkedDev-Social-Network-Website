var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator")
const User = require("../models/User");
const gravatar = require("gravatar")
const bcrypt = require("bcrypt")
const auth = require("../config/auth")



router.get('/edit', auth, function (req, res, next) {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(user)
        res.render("profileEdit", {
            user,
            learning: user.learning.join(","),
            expert: user.expert.join(","),
            linkedin: user?.socialMedia?.linkedin ? user?.socialMedia?.linkedin : "",
            twitter: user?.socialMedia?.twitter ? user?.socialMedia?.twitter : "",
            website: user?.socialMedia?.website ? user?.socialMedia?.website : ""
        })
    })

});
router.post("/edit", async (req, res) => {
    // check validation
    await check("email", "email is inValid").isEmail().notEmpty().run(req);
    const errors = validationResult(req);
    const { name, email, position, company, learning, expert, twitter, linkedin, website } = req.body;
    User.findById(req.user.id, (err, currentUser) => {
        if (err) {
            console.log(err)
            return
        }

        // if there is a validation error then render it to the user
        if (!errors.isEmpty()) {
            return res.render("profileEdit", {
                user: currentUser,
                learning: currentUser.learning.join(","),
                expert: currentUser.expert.join(","),
                linkedin: currentUser?.socialMedia?.linkedin ? currentUser?.socialMedia?.linkedin : "",
                twitter: currentUser?.socialMedia?.twitter ? currentUser?.socialMedia?.twitter : "",
                website: currentUser?.socialMedia?.website ? currentUser?.socialMedia?.website : "",
                errors: errors.array()
            })
        }
        User.find({ email: email }, (err, user) => {
            if (err) {
                console.log(err)
                return
            }
            // check if the user exists in the database
            if (user.length >= 1) {
                let errorObj = { msg: "Email already exists" }
                for (person of user) {
                    if (person.id !== req.user.id) {
                        return res.render("profileEdit", {
                            user: currentUser,
                            learning: currentUser.learning.join(","),
                            expert: currentUser.expert.join(","),
                            linkedin: currentUser?.socialMedia?.linkedin ? currentUser?.socialMedia?.linkedin : "",
                            twitter: currentUser?.socialMedia?.twitter ? currentUser?.socialMedia?.twitter : "",
                            website: currentUser?.socialMedia?.website ? currentUser?.socialMedia?.website : "",
                            errors: [errorObj]
                        })
                    }
                }
            }
            // create a new user
            let updatedUser = {}
            console.log(req.body)
            updatedUser.name = name;
            updatedUser.email = email;
            const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'retro' }, true)
            updatedUser.image = avatar;
            updatedUser.position = position;
            updatedUser.company = company;
            updatedUser.learning = learning.split(",");
            updatedUser.expert = expert.split(",");
            const socialMedia = {}
            if (twitter) socialMedia.twitter = `https://twitter.com/${twitter}`
            if (linkedin) socialMedia.linkedin = linkedin
            if (website) socialMedia.website = website
            updatedUser.socialMedia = socialMedia;

            User.updateOne({ _id: req.user.id }, updatedUser, (err) => {
                if (err) {
                    console.log(err)
                    return;
                }
                res.redirect('/dashboard')
            })

        })
    })








})

module.exports = router;