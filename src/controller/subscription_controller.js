const subscription = require("../models/subscriptions");
const {ObjectId} = require("mongodb");
app.post('/addSubscription', jsonParser, async function (req, res) {
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

app.post('/getSubscriptionsList', jsonParser, async function (req, res) {
    console.log(req)
    const filter = {user_id: req.body.user_id};
    const all = await subscription.find(filter);
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.send(JSON.stringify(all));
});

app.post('/deleteSubscription', jsonParser, async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const id = new ObjectId(req.body.subscription_id)
        await subscription.deleteOne({_id: id});
        res.send('Earning Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});