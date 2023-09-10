const calendarService = require("../services/calendar_service")

app.post('/addCalendarEvent', jsonParser, async function (req, res) {
    try {
        await calendarService.addCalendarEvent(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Calendar Event');
    }
});

app.post('/getCalendarData', jsonParser, async function (req, res) {
   try {
       const calendarData = await calendarService.getCalendarData(req.body.userId)
       res.send(calendarData)
   } catch (error) {
       res.send('Error While Fetching Calendar Data');
   }
});