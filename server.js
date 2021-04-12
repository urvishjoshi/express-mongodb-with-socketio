const dotenv = require('dotenv').config();
const express = require('express')
const app = express()
const ejs = require('ejs');
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');
const laravelmix = require('laravel-mix');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const Emitter = require('events');

// for defining path for asset files
app.use(express.static('public'))
app.use(ejsLayouts)
// for defining path for view .ejs files
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//connect mongoDB
const url = process.env.MONGODB_URL
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:true
})
const connection = mongoose.connection
connection.once('open', () => {
    console.log('connected')
}).catch(err => {
    console.log(err);
})


// displaying objects in console
app.use(express.json())
// url request data getting
app.use(express.urlencoded({ extended: false }))

//use cookie
app.use(flash())
//store session
let mongoStore = MongoStore.create({
    mongoUrl: url,
    collectionName: "sessions",
});

//use session
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}
}))

// passport
const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// set session as global 
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


// web routes
require('./routes/web')(app)
// 404 error
app.use((req, res) => {
    res.status(404).render('errors/404')
})

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

const server = app.listen(process.env.PORT)

// establish connection
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // bind user with a unique id
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (order) => {
    io.to(`order_${order.id}`).emit('orderUpdated', order)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to(`adminRoom`).emit('orderPlaced', data)
})