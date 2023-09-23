const subscription = require("../models/subscriptions");
const {ObjectId} = require("mongodb");
const express = require('express');
const router = express.Router();
const verifyToken = require("../validations/authorization_service")
const jsonResponse = require('../validations/json_response')


router.post('/addSubscription', verifyToken, jsonResponse, async function (req, res) {
    try {
        console.log(req.body);
        const subs = new subscription(req.body);
        const id = new ObjectId(req.body.user_id)
        await subs.save();
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Subscription');
    }
});

router.post('/getSubscriptionsList', verifyToken, jsonResponse, async function (req, res) {
    console.log(req)
    const filter = {user_id: req.body.user_id};
    const all = await subscription.find(filter);
    res.send(JSON.stringify(all));
});

router.post('/deleteSubscription', verifyToken, jsonResponse, async function (req, res) {
    try {
        const id = new ObjectId(req.body.subscription_id)
        await subscription.deleteOne({_id: id});
        res.send('Earning Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});

module.exports = router;