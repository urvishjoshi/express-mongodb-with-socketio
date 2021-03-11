const homeController = require('../app/http/homeController');
const authController = require('../app/http/authController');
const cartController = require('../app/http/customer/cartController');
const orderController = require('../app/http/customer/orderController');
const adminOrderController = require('../app/http/admin/adminOrderController');
const guest = require('../app/middlewares/guest')
const auth = require('../app/middlewares/auth')

function routes(app) {

    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().doLogin)
    app.post('/logout', authController().logout)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().doRegister)
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    // customer
    app.post('/orders', auth, orderController().store)
    app.get('/customers/orders', auth, orderController().index)
    
    //admin
    app.get('/admin/orders', auth, adminOrderController().index)
}

module.exports = routes