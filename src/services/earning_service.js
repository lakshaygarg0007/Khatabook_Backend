const {ObjectId} = require("mongodb");
const Earnings = require("../models/earnings");
const User = require("../models/users");
const verifyToken = require("../validations/authorization_service");

async function getEarning(userId) {
    const filter = {user_id: userId};
    const all = await Earnings.find(filter);
    all.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
    });
    return JSON.stringify(all);
}

async function addEarning(earningData) {
    const earning = new Earnings(earningData);
    const id = new ObjectId(earningData.user_id)
    const user = await User.find({_id: id});
    await User.updateOne({_id: id},
        {
            $set: {
                total_earning: parseFloat(user[0].total_earning) + parseFloat(earningData.amount)
            }
        });
    earning.save();
}

async function deleteEarning(earningId) {
    const id = new ObjectId(earningId)
    const existingEarning = await Earnings.findOne({ _id: id});
    await Earnings.deleteOne({_id: id});
    const user = await User.findById(existingEarning.user_id);
    const new_total_earning = user.total_earning - existingEarning.amount
    await User.updateOne(
        {
            _id: existingEarning.user_id
        },
        {$set: {total_earning: new_total_earning
        }}
    );
}

async function updateEarning(earningData) {
    try {
        const earning_id = new ObjectId(earningData.earning_id)
        const existingEarning = await Earnings.findOne({ _id: earning_id});
        const new_earning = earningData.amount;
        const {amount: previous_earning, user_id} = await Earnings.findOneAndUpdate(
            {_id: earning_id},
            {$set: {amount: new_earning}},
            {new: true}
        );

        const user = await User.findById(user_id);
        const earning_difference = parseFloat(new_earning) - parseFloat(existingEarning.amount);
        const updated_total_earning = parseFloat(user.total_earning) + parseFloat(earning_difference);
        await User.updateOne({_id: user_id}, {$set: {total_earning: updated_total_earning}});
        await Earnings.updateOne({_id: earning_id}, {$set: {amount: new_earning}});
        res.send('Record Saved Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error While Updating Earning');
    }
}

module.exports = {
    getEarning,
    addEarning,
    deleteEarning,
    updateEarning
}