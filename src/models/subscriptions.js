const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    subscription: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('Subscriptions', userSchema);