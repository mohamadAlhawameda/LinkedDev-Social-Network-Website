const mongoose = require("mongoose");
const User = require('../models/User');
const Comment = require('../models/Comment');
let forumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        ref: User,
        required: true,
    },
    image: {
        type: String,
        ref: User,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: {
        type: [Object],
        ref: Comment,
        required: true,
    },
});

module.exports = mongoose.model("Forum", forumSchema);

