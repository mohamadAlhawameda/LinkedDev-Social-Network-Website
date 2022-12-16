const mongoose = require("mongoose");
const User = require('../models/User');
let commentSchema = mongoose.Schema({
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
});
module.exports = mongoose.model("Comment", commentSchema);