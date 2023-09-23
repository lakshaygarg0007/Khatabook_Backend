const pieChartService = require("../services/piechart_service")
const express = require('express')
const router = express.Router()
const verifyToken = require("../validations/authorization_service")
const jsonResponse = require('../validations/json_response')

router.post('/getPieChartData', verifyToken, jsonResponse, async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    try {
        const pieChartData = await pieChartService.getPieChartData(req.body.userId)
        res.send(JSON.stringify(pieChartData));
    } catch (error) {
        res.send('Could not retrieve pie chart data');
    }
});

module.exports = router;
