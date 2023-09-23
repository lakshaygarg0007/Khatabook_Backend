const Expenses = require("../models/expenses");
async function getPieChartData(userId) {
    const filter = {user_id: userId};
    const aggregationPipeline = [
        {$match: filter},
        {
            $group: {
                _id: "$payment_method",
                amount: {$sum: "$amount"}
            }
        },
        {
            $project: {
                _id: 0,
                payment_method: "$_id",
                amount: 1
            }
        }
    ];

    const result = await Expenses.aggregate(aggregationPipeline);
    return result
}

module.exports = {
    getPieChartData
}
