const {ObjectId} = require("mongodb");
const User = require("../models/users");
const express = require('express');
const router = express.Router();
const verifyToken = require("../validations/authorization_service")
const jsonResponse = require('../validations/json_response')

const earningService = require('../services/earning_service');

router.post('/deleteEarning', verifyToken, jsonResponse, async function (req, res) {
    try {
        await earningService.deleteEarning(req.body.earning_id)
        res.send('Earning Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});

router.post('/getTotalEarning', verifyToken, jsonResponse, async function (req, res) {
    const id = new ObjectId(req.body.id);
    const all = await User.find({_id: id}, {total_earning: 1});
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(all));
});

router.post('/getEarning', verifyToken, jsonResponse, async function (req, res) {
    try {
        const earningData = await earningService.getEarning(req.body.user_id)
        res.send(JSON.parse(earningData))
    } catch (error) {
        res.status(500).send('Error While Updating Earning');
    }
});

router.post('/updateEarning', verifyToken, jsonResponse, async (req, res) => {
    try {
        await earningService.updateEarning(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        res.status(500).send('Error While Updating Earning');
    }
});

router.post('/addEarning', verifyToken, jsonResponse, async function (req, res) {
    try {
        await earningService.addEarning(req.body)
        res.send('Record Saved Successfully')
    } catch (error) {
        res.send('Error While Adding Earning');
    }
});

module.exports = router;