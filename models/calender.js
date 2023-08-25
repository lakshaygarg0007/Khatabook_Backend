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
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    meeting_link: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Calendar', userSchema);