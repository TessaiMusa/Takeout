const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

router.get('/', (req, res) => res.render('welcome'))

router.post('/dashbord', ensureAuthenticated, (req,res) => {
    let type = req.user.type
    if (!type)
        res.status(400).send('Error 400')
    
})

module.exports = router