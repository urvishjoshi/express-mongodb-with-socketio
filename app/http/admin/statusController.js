const Order = require('../../models/order');

function statusController() {
    return {
        update(req, res) {
            request = req.body
            Order.updateOne({ _id: request.orderId }, { status: request.status }, (err, data) => {
                if (err)
                    return res.json(data.nModified)
                    
                // emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: request.orderId, status: request.status })
                return res.json(data.nModified)
            })
        }
    }
}

module.exports = statusController