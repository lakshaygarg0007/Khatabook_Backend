const {ObjectId} = require("mongodb");
const Earnings = require("../models/earnings");
const User = require("../models/users");
const verifyToken = require("../../authorization/AuthorizationJWTToken");

const earningService = require('../services/earning_service');

app.post('/deleteEarning', jsonParser, async function (req, res) {
    try {
        await earningService.deleteEarning(req.body.earning_id)
        res.send('Earning Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});

app.post('/getTotalEarning', async function (req, res) {
    const id = new ObjectId(req.body.id);
    const all = await User.find({_id: id}, {total_earning: 1});
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(all));
});

app.post('/getEarning', verifyToken, jsonParser, async function (req, res) {
    try {
        const earningData = await earningService.getEarning(req.body.user_id)
        res.add(earningData)
    } catch (error) {
        res.status(500).send('Error While Updating Earning');
    }
});

app.post('/updateEarning', jsonParser, async (req, res) => {
    try {
        await earningService.updateEarning(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        res.status(500).send('Error While Updating Earning');
    }
});

app.post('/addEarning', jsonParser, async function (req, res) {
    try {
        await earningService.addEarning(req.body)
        res.send('Record Saved Successfully')
    } catch (error) {
        res.send('Error While Adding Earning');
    }
});