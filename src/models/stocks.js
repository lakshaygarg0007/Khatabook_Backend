const mongoose = require('mongoose');
const stocks = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    stock_name: {
        type: String,
        required: true,
    },
    purchase_date: {
        type: String,
        required: true,
    },
    purchase_rate: {
        type: String,
        required: true,
    },
    current_rate: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Stocks', stocks);



