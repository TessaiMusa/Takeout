const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

//Food model
const Food = require('../models/Foods')

router.get('/dashbord', ensureAuthenticated, (req, res) => {
    let type = req.user.type
    if (type === 0)
        res.redirect('vendor')
    else
        res.redirect('customer')
})

router.get('/vendor', ensureAuthenticated, (req, res) => {
    res.render('vendor/dashbord')
})

router.get('/view_list', ensureAuthenticated, (req, res) => {
    let vendorName = req.user.name
    Food.find({vendorName: vendorName})
        .then(foods => {
            console.log(foods)
            res.send('Check console.log')
        })
})

router.post('/vendor', ensureAuthenticated, (req,res) => {
    let {name, description, price} = req.body
    let vendorName = req.user.name
    
    let errors = []
    Food.findOne({name: name})
        .then(food => {
            if (food)
            {
                errors.push({msg: 'Food Name already exists'})
                res.render('vendor/dashbord', {errors})
            } else {
                price = Number(price)
                const newFood = new Food({
                    name, description, price, vendorName,
                })
                newFood.save().then(food => {
                    req.flash('success_msg', 'Successfully registered the food')
                    res.redirect('vendor')
                }).catch(e => {
                    throw e
                })
            }
        }).catch(e => res.status(400).send('Error 400'))
})

module.exports = router