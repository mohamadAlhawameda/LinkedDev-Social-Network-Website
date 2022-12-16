const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User")
const bcrypt = require("bcrypt")

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({usernameField: "email"}, (email, password, done) => {
            User.findOne({email: email}, (err, user)=> {
                if (err){
                    console.log(err)
                    return;
                }
                if (!user) {
                    return done(null, false, {message: "User not Found!"})
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err){
                        console.log(err)
                        return;
                    }
                    if (isMatch){

                        return done(null, user);
                    }else{
                        return done(null, false, {message: "Invalid Credentials"})
                    }
                })
            })
        })
    )
    passport.serializeUser((user, done) => {

        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) =>{
            if (err){
                done(null, false, {message: err})
            }else{
                done(err, user)
            }
        })
    })
}