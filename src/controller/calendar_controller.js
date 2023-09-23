const calendarService = require("../services/calendar_service")
const express = require('express');
const router = express.Router();
const verifyToken = require("../validations/authorization_service")
const jsonResponse = require('../validations/json_response')

router.post('/addCalendarEvent', verifyToken, jsonResponse, async function (req, res) {
    try {
        await calendarService.addCalendarEvent(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Calendar Event');
    }
});

router.post('/getCalendarData', verifyToken, jsonResponse, async function (req, res) {
   try {
       const calendarData = await calendarService.getCalendarData(req.body.userId)
       res.send(calendarData)
   } catch (error) {
       res.send('Error While Fetching Calendar Data');
   }
});

module.exports = router;