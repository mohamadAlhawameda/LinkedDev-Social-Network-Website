var express = require('express');
var router = express.Router();
const Users = require("../models/User");

router.get("/:id", function (req, res, next) {
    Users.findOne({ _id: req.params.id }, (error, userConnect) => {
        if (error) {
            throw error;
        }
        else {

            res.render("userConnect", { xUser: userConnect})
        }
    })
});

module.exports = router;