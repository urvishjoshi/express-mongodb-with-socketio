const Order = require('../../models/order')
const moment = require('moment')

function orderController() {
    return {
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                {sort: { 'createdAt': -1}}
                )
            return res.render('customers/orders/index', {orders, moment})
        },

        async show(req, res) {
            const order = await Order.findById(req.params.id)

            if (req.user._id.toString() == order.customerId.toString())
                return res.render('customers/orders/show', { order })
            return res.render('/')
        },

        store(req, res) {
            const { address } = req.body    
            if(!address) {
                req.flash('error', 'Address is required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                address,
            })

            order.save().then(result => {
                req.flash('success', 'Order is placed')
                delete req.session.cart
                return res.redirect('/customers/orders')
            }).catch(err => {
                req.flash('error', 'Failed')
                return res.redirect('/cart')
            })
        }
    }
}

module.exports = orderController