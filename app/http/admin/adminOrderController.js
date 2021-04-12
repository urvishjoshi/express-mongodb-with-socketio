const Order = require('../../models/order');
const Menu = require('../../models/menu');

function orderController() {
    return {
        index(req, res) {
            Order.find({ status: {$ne: 'completed'} }, null, { sort: { 'createdAt': -1 } })
            .populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr) {
                    return res.json(orders)
                } else {
                    return res.render('admin/orders')
                }
            })
        },

        store(req, res) {
            let { name, price, size } = req.body
            var menu =  new Menu({ name, image: '/', price, size })

            menu.save().then(result => {
                req.flash('toast','Pizza created successfully')
            }).catch(err => {
                req.flash('errorToast', err.messages)
            })
            
            return res.redirect('/')
        }
    }
}

module.exports = orderController