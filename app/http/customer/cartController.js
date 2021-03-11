function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart/index')
        },

        update(req, res, next) {
            
            if (!req.isAuthenticated()) {
                res.send('unauthorized');
                return false;
            }

            let pizza = req.body

            if(!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQuantity: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
            if(!cart.items[pizza._id]) {
                cart.items[pizza._id] = {
                    item: pizza,
                    quantity: 1,
                    itemTotalPrice : pizza.price
                }
                cart.totalQuantity += 1
                cart.totalPrice = pizza.price + cart.totalPrice
            } else {
                cart.items[pizza._id].quantity += 1
                cart.items[pizza._id].itemTotalPrice += pizza.price
                cart.totalPrice = pizza.price + cart.totalPrice
                cart.totalQuantity += 1
            }
            res.json(cart)
        }
    }
}

module.exports = cartController