const expenseService = require('../services/expense_service');
const express = require('express');
const router = express.Router();
const verifyToken = require("../validations/authorization_service")
const jsonResponse = require('../validations/json_response')

router.post('/updateExpense', verifyToken, jsonResponse, async (req, res) => {
    try {
        await expenseService.updateExpense(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error While Updating Earning');
    }
});

router.post('/addExpense', verifyToken, jsonResponse, async function (req, res) {
    try {
        await expenseService.addExpense(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Expense');
    }
});

router.post('/getExpense', verifyToken, jsonResponse, async function (req, res) {
    try {
        const expenseData = await expenseService.getExpense(req.body.userId);
        res.send(expenseData)
    } catch (error) {
        res.send('Error While Fetching Expense');
    }
});

router.post('/deleteExpense', verifyToken, jsonResponse, async function (req, res) {
    try {
        await expenseService.deleteExpense(req.body)
        res.send('Expense Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});

router.post('/getTotalExpense', verifyToken, jsonResponse, async function (req, res) {
    try {
        const expenseData = await expenseService.getTotalExpense(req.body.userId)
        res.send(expenseData)
    } catch (error) {
        res.send('Error While Fetching Total Expense');
    }
});

module.exports = router;