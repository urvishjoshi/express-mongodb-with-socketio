const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    return {
        login(req, res) {
            res.render('auth/login')
        },

        doLogin(req, res, next) {
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req, res, next)
        },

        register(req, res) {
            res.render('auth/register')
        },

        async doRegister(req, res) {
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                req.flash('error','All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            User.exists({ email: email}, (err, result) => {
                if (result) {
                    req.flash('error', 'Email is already used')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }
            })

            const hash = await bcrypt.hash(password, 10)
            const user = new User({
                name,
                email,
                password: hash
            })
            user.save().then((user) => {
                return res.redirect('/')
            }).catch(err => {

            })
        },

        logout(req, res) {
            req.logout()
            res.redirect('/')
        }
    }
}

module.exports = authController