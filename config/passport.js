const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/Users')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // Match user
            User.findOne({email})
                .then(user => {
                    if (!user) {
                        console.log('Failed')
                        return done(null, false, {message: "Email not regsitered"})
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err

                        if(isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, {message: "Password incorrect"})
                        }

                    })
                }).catch(e => {
                    console.error(e)
                    done(err)
                })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}