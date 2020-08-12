if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

require('./config/passport')(passport)

// DBconfig
mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({extended: false}))

// Express Session 
app.use(session({
    secret: 'kill every last one of them',
    resave: true,
    saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const port = process.env.PORT

app.listen(port, console.log(`server started on port ${port}`))