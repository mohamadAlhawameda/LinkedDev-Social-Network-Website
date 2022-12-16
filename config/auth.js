module.exports = (req, res, next) => {
    // check if user exists in the req.user;
    if (!req.user) {
        return res.redirect("/login")
    }
    next()
}