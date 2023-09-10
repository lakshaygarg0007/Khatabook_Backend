const mongoose = require('mongoose');
const expenses = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    
});

module.exports = mongoose.model('Expenses', expenses);



