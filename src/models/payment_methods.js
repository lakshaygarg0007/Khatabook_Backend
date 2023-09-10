const mongoose = require('mongoose');
const payment_methods = mongoose.Schema({
    payment_methods: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('PaymentMethods', payment_methods);