const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

//Food model
const Food = require('../models/Foods')
const Transaction = require('../models/Transactions')

router.get('/dashbord', ensureAuthenticated, (req, res) => {
    let type = req.user.type
    if (type === 0)
        res.redirect('vendor')
    else
        res.redirect('customer')
})

// Vendors

router.get('/vendor', ensureAuthenticated, (req, res) => {
    res.render('vendor/dashbord')
})

router.get('/view_list', ensureAuthenticated, (req, res) => {
    let vendorName = req.user.name
    Food.find({vendorName: vendorName})
        .then(foods => {
            res.render('vendor/check', {foods})
        })
})

router.get('/view_current', ensureAuthenticated, (req, res) => {
    let vendorName = req.user.name
    Transaction.find({vendorName, completed: false})
        .then(foods => {
            res.render('vendor/current', {foods})
        })
})

router.get('/view_current/:id', ensureAuthenticated, (req, res) => {
    let vendorName = req.user.name
    let _id = req.params.id
    Transaction.findByIdAndUpdate({_id}, {completed: true}, {useFindAndModify: false})
        .then(transaction => {
            if(!transaction)
                res.status(500).send("Error 500")
            res.redirect('/page/view_current')
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

// Customer
router.get('/customer', ensureAuthenticated, (req,res) => {
    res.render('customer/dashbord')
})

router.get('/offers', ensureAuthenticated, (req, res) => {
    Food.find({currentOffer: {$gt: 0}}).then(foods => {
        if (foods)
            res.render('customer/offers', {foods})
    })
})

router.get('/new_order', ensureAuthenticated, (req, res) => {
    Food.distinct('vendorName')
        .then(vendors => {
            res.render('customer/select_vendors', {vendors})
        })
})

router.get('/new_order/:vendorName', ensureAuthenticated, (req, res) => {
    let name = req.params.vendorName

    Food.find({vendorName: name})
        .then(foods => {
            res.render('customer/select_foods', {foods})
        })
})

router.get('/new_order/:vendorName/:foodName', ensureAuthenticated, (req, res) => {
    let vName = req.params.vendorName
    let fName = req.params.foodName

    Food.findOne({vendorName: vName, name: fName})
        .then(food => {
            console.log(food)
            res.render('customer/select_confirm', {food})
        })
})

router.post('/new_order/:vendorName/:foodName', ensureAuthenticated, (req,res) => {
    let type = req.body.type
    if(type === "no")
        res.redirect('/page/new_order')
    else
    {
        let foodName = req.params.foodName
        let vendorName = req.params.vendorName
        let userName = req.user.email
        const newTransaction = new Transaction({foodName, vendorName, userName})
        newTransaction.save().then(transaction => {
            res.send('Done')
        }).catch(e => res.status(500).send('Error 500'))
    }
})

router.get('/current_orders', ensureAuthenticated, (req, res) => {
    let userName = req.user.email
    Transaction.find({userName})
        .then(transaction => {
            res.render('customer/current', {foods: transaction})
        })
})

router.get('/current_orders/:id', ensureAuthenticated, (req, res) => {
    let _id = req.params.id

    Transaction.findOneAndDelete({_id})
        .then(transaction => {
            res.redirect('/page/current_orders')
        })
})

module.exports = router