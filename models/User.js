const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    company: {
        type: String,
        required: true
    },

    position: {
        type: String,
        required: true,
    },
    learning: {
        type: [String],
        required: true
    },
    expert: {
        type: [String],
        required: true
    },
    socialMedia: {
        twitter: { type: String }, linkedin: { type: String }, website: { type: String }
    },

});
const exportSchema = mongoose.model("user", userSchema);
module.exports = exportSchema;