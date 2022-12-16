var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Forum = require('../models/Forum')
const Comment = require('../models/Comment')
const User = require('../models/User');
const auth = require("../config/auth")
const { check, validationResult } = require('express-validator');


router.get('/', auth, function (req, res, next) {
    Forum.find({}, function (error, forumsArray) {
        if (error) {
            throw error;
        }
        else {
            console.log(forumsArray)
            res.render('forum', { title: 'Forum Post Board', forums: forumsArray });
        }
    })

});
router.get('/delete/:id', auth, function (req, res, next) {
    var id = req.params.id;
    Forum.deleteOne({ _id: id }, (error) => {
        if (error) {
            res.send("Error");
        }
        else {
            res.redirect("/forum");
        }
    });
})

router.get('/edit/:id', auth, function (req, res, next) {
    var id = req.params.id;
    Forum.findById(id, (error, forum) => {
        if (error) {
            res.end("You cannot edit this book");
        }
        else {
            res.render('editforum', { title: 'Edit comment', forum: forum });
        }
    });
});
router.post("/edit/:id", async (req, res) => {
    var id = req.params.id;
    var forum = {};
    forum.title = req.body.title;
    forum.user = req.body.name;
    forum.image = req.body.image;
    forum.content = req.body.content;
    forum.comments = req.body.comments;

    Forum.updateOne({ _id: id }, forum, (error) => {
        res.redirect("/forum");
    });

})

router.get('/add', auth, function (req, res, next) {
    User.findById(req.user.id, (err, user) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(user.name)
        res.render('addforum', { user, title: 'Add a forum' });
    })

});
router.post("/add", async (req, res) => {
    User.findById(req.user.id, (err, user) => {
        const errors = validationResult(req);
        if (err) {
            console.log(err)
            return
        }
        console.log(user.name)
        var forum = new Forum();
        forum.title = req.body.title;
        forum.user = user.name;
        forum.image = user.image;
        forum.content = req.body.content;
        forum.comments = [];
        if (errors.isEmpty()) {
            forum.save((error) => {
                if (error) {
                    console.log(error);
                    res.end("Error happened")
                }
                else {
                    res.redirect("/forum");
                }
            });
        }
        else {
            res.render("addforum", { user, "errors": errors.array() })
        }
    })
})


router.get('/comment/:id', auth, function (req, res, next) {
    var id = req.params.id;
    Forum.findById(id, (error, forum) => {
        if (error) {
            res.end("You cannot edit this book");
        }
        else {
            console.log(forum)
            res.render('commentforum', { title: 'Add your comment', forum: forum });
        }
    });
});

router.post("/comment/:id", async (req, res) => {
    var id = req.params.id;
    User.findById(req.user.id, (err, user) => {
        const errors = validationResult(req);
        if (err) {
            console.log(err)
            return
        }
        console.log(user)
        Forum.findById(id, (err, forum) => {
            const errors = validationResult(req);
            if (err) {
                console.log(err)
                return
            }

            var newComment = new Comment();
            newComment.user = user.name;
            newComment.image = user.image;
            newComment.content = req.body.content;
            if (err) {
                console.log(err);
            } else {
                // Push a new element into the array
                forum.comments.push(newComment);

                // Save the document to the database
                forum.save((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Document updated successfully");
                        res.redirect("/forum");
                    }
                });
            }
        })
    })
})
module.exports = router;