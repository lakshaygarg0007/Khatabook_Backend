const Expenses = require("../models/expenses");
const {ObjectId} = require("mongodb");
const User = require("../models/users");

async function getExpense(userId){
    const filter = {user_id: userId};
    const all = await Expenses.find(filter);
    all.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
    });

    return JSON.stringify(all);
}

async function addExpense(expenseData){
    const expense = new Expenses(expenseData);
    const id = new ObjectId(expenseData.user_id)
    const user = await User.find({_id: id});
    await User.updateOne({_id: id}, {
        $set: {total_expense: parseFloat(user[0].total_expense) + parseFloat(expenseData.amount)}
    });
    expense.save();
}

async function deleteExpense(expenseId) {
    const id = new ObjectId(expenseId)
    const existingExpense = await Expenses.findOne({ _id: id});
    await Expenses.deleteOne({_id: id});
    const user = await User.findById(existingExpense.user_id);
    const new_total_expense = user.total_expense - existingExpense.amount
    await User.updateOne({_id: existingExpense.user_id}, {$set: {total_expense: new_total_expense}});
}

async function updateExpense(expenseData) {
    const expense_id = new ObjectId(expenseData.expense_id);
    const new_expense = expenseData.amount;
    const {amount: previous_expense, user_id} = await Expenses.findOneAndUpdate(
        {_id: expense_id},
        {$set: {amount: new_expense}},
        {new: true}
    );

    const user = await User.findById(user_id);
    const expense_difference = parseFloat(new_expense) - parseFloat(previous_expense);
    const updated_total_expense = parseFloat(user.total_expense) + parseFloat(expense_difference);
    await User.updateOne({_id: user_id}, {$set: {total_expense: updated_total_expense}});
    await Expenses.updateOne({_id: expense_id}, {$set: {amount: new_expense}});
}

async function getTotalExpense(userId) {
    const id = new ObjectId(userId);
    const all = await User.find({_id: id}, {total_expense: 1});
    return JSON.stringify(all);
}

module.exports =  {
    getExpense,
    addExpense,
    deleteExpense,
    updateExpense,
    getTotalExpense
}

