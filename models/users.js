const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    total_expense: {
        type: String,
        default: '0.0',
    },
    total_earning: {
        type: String,
        default: '0.0',
    },
    subscription_type: {
        type: String,
        default: 'Trial'
    },
    phone_number: {
        type: String,
        default: '9914087195'
    }
});

module.exports = mongoose.model('User', userSchema);