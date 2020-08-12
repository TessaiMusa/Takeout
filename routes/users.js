const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

//user model
const User = require('../models/Users')

// Login page
router.get('/login', (req, res) => res.render("login"))

// Login handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/page/dashbord',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next)
})

// Register page
router.get('/register', (req, res) => res.render("register"))

//register handle
router.post('/register', (req, res) => {
    const {name, email, password, type} = req.body
    let errors = []

    // verify
    if(!name || !email || !password) {
        errors.push({msg: "Please fill all fields"})
    }

    if (errors.length > 0) {
        res.render('register', {errors})
    } else {
        // Validation passed
        User.findOne({ email: email})
            .then(user => {
                if (user) {
                    errors.push({msg: "User exiss, please login"})
                    res.render('register', {errors})
                } else {
                    const newUser = new User({
                        name, email, password, type
                    })
                    newUser.type = Number(newUser.type)

                    // hash password
                    bcrypt.hash(newUser.password, 10, (err, hash) => {
                        if (err) throw err

                        //set password to hash
                        newUser.password = hash
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now regsitered and can login')
                                res.redirect('login')
                            
                            })
                            .catch(e => {
                                console.error(e)
                                res.status(500).send('Error')
                            })
                    })
                }
                
            })

    }

})

// logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('login')
})


module.exports = router