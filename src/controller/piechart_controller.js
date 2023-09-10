const pieChartService = require("../services/piechart_service");

app.post('/getPieChartData', jsonParser, async function (req, res) {
    try {
        const pieChartData = pieChartService.getPieChartData(req.body.userId)
        res.send(pieChartData);
    } catch (error) {
        res.send('Could not retrieve pie chart data');
    }
});