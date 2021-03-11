const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: { type: Object, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true , default: 'order_placed'},
    paymentType: { type: String, default: 'COD' },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)