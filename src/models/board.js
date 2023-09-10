const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type:Date,
        required: false
    }
});

module.exports = mongoose.model('Board', userSchema);