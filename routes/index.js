const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')


router.get('/', (req, res) => res.render('welcome'))

router.get('/dashbord', ensureAuthenticated, (req, res) => res.render('dashbord', {name: req.user.name}))

module.exports = router