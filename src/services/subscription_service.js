const subscription = require("../models/subscriptions");
const {ObjectId} = require("mongodb");
async function addSubscription(subscriptionData) {
    const subs = new subscription(subscriptionData);
    await subs.save();
}

async function getSubscriptionsList(userId) {
    const filter = {user_id: userId};
    const all = await subscription.find(filter);
    return JSON.stringify(all)
}

async function deleteSubscription(subscription_id) {
    const id = new ObjectId(subscription_id)
    await subscription.deleteOne({_id: id});
}

module.exports = {
    addSubscription,
    deleteSubscription,
    getSubscriptionsList
}