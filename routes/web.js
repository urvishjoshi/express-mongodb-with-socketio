const homeController = require('../app/http/homeController');
const authController = require('../app/http/authController');
const cartController = require('../app/http/customer/cartController');
const orderController = require('../app/http/customer/orderController');
const adminOrderController = require('../app/http/admin/adminOrderController');
const statusController = require('../app/http/admin/statusController');
//middlewares
const guest = require('../app/middlewares/guest')
const auth = require('../app/middlewares/auth')
const admin = require('../app/middlewares/admin')

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
    app.get('/customers/orders/:id', auth, orderController().show)
    
    //admin
    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/orders/status', admin, statusController().update)
}

module.exports = routes