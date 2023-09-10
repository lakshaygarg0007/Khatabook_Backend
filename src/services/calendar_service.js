const Calendar = require("../models/calender");

async function addCalendarEvent(calendarData) {
    const calendar = new Calendar(calendarData);
    await calendar.save();
}


async function getCalendarData(userId) {
    const filter = {user_id: userId};
    const all = await Calendar.find(filter);
    return JSON.stringify(all);
}

module.exports = {
    getCalendarData,
    addCalendarEvent
}