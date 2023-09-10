const expenseService = require('../services/expense_service');


app.post('/updateExpense', jsonParser, async (req, res) => {
    try {
        await expenseService.updateExpense(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error While Updating Earning');
    }
});

app.post('/addExpense', jsonParser, async function (req, res) {
    try {
        await expenseService.addExpense(req.body)
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Expense');
    }
});

app.post('/getExpense', jsonParser, async function (req, res) {
    try {
        const expenseData = await expenseService.getExpense(req.body.userId);
        res.send(expenseData)
    } catch (error) {
        res.send('Error While Fetching Expense');
    }
});

app.post('/deleteExpense', jsonParser, async function (req, res) {
    try {
        await expenseService.deleteExpense(req.body)
        res.send('Expense Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});

app.post('/getTotalExpense', async function (req, res) {
    try {
        const expenseData = await expenseService.getTotalExpense(req.body.userId)
        res.send(expenseData)
    } catch (error) {
        res.send('Error While Fetching Total Expense');
    }
});