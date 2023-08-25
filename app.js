const express = require('express');
const app = express();
const port = 8000;
const data = require('./data');
const mongoose = require('mongoose');
const Earnings = require('./models/earnings');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/users');
const Expenses = require('./models/expenses');
const PaymentMethods = require('./models/payment_methods');
const parser = require('body-parser');
const subscription = require('./models/subscriptions')
const Calendar = require('./models/calender')
const Board = require('./models/board')
const ObjectId = require('mongodb').ObjectId;
const fs = require("fs");
const https = require("https");
// const corsOptions = {
//   origin: ['http://localhost:5173/', 'https://localhost:5173/'],
//   credentials: true,
//   // Adjust the port as needed
//   // Other options if needed
// };
//
// const options = {
//   key: fs.readFileSync('localhost-key.pem'),
//   cert: fs.readFileSync('localhost.pem'),
// };


// console.log('Key content:', options.key.toString());
// console.log('Cert content:', options.cert.toString());


//const server = https.createServer(options, app);

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(data.data));
});

mongoose.connect('mongodb+srv://lakshaygarg:hmtQHahi3aZR2P7T@cluster0.sqbda3w.mongodb.net/test', {useNewUrlParser: false});
mongoose.connection.once('open', function () {
    console.log('Database connected Successfully');
}).on('error', function (err) {
    console.log('Error', err);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


app.get('/usersList', async function (req, res) {
    const filter = {};
    const all = await Earnings.find(filter);
    all.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
    });
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(all));
});

var jsonParser = parser.json()

app.post('/addEarning', jsonParser, async function (req, res) {
    try {
        console.log(req.body);
        var earning = new Earnings(req.body);
        var id = new ObjectId(req.body.user_id)
        const user = await User.find({_id: id});
        await User.updateOne({_id: id},
            {
                $set: {
                  total_earning: parseFloat(user[0].total_earning) + parseFloat(req.body.amount)
                }
            });
        earning.save();
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Earning');
    }
});

//const ObjectId = require('mongoose').Types.ObjectId;

app.post('/updateEarning', jsonParser, async (req, res) => {
    try {
        const earning_id = new ObjectId(req.body.earning_id)
        const existingEarning = await Earnings.findOne({ _id: earning_id});
        const new_earning = req.body.amount;
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
});


app.post('/updateExpense', jsonParser, async (req, res) => {
    try {
        const expense_id = new ObjectId(req.body.expense_id);
        const new_expense = req.body.amount;
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
        res.send('Record Saved Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error While Updating Earning');
    }
});


app.post('/signup', jsonParser, async function (req, res) {
    try {
        console.log(req.body);
        var user = new User(req.body);
        res.setHeader('content-type', 'application/json');
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    console.log('Email id Already Exists');
                    res.send('Email id Already Exists');
                } else {
                    console.log(err);
                }
            } else {
                console.log('Successfully Signed Up');
                res.send('Successfully Signed Up');
            }
        });
    } catch (error) {
        res.send('Error While Signup');
    }
});

app.post('/addExpense', jsonParser, async function (req, res) {
  try {
    console.log(req.body);
    var expense = new Expenses(req.body);
    var id = new ObjectId(req.body.user_id)
    const user = await User.find({_id: id});
    console.log(user[0].total_expense)
    await User.updateOne({_id: id}, {
      $set: {total_expense: parseFloat(user[0].total_expense) + parseFloat(req.body.amount)}
    });
    expense.save();
    res.send('Record Saved Successfully');
  } catch (error) {
    res.send('Error While Adding Expense');
  }
});


app.post('/getExpense', jsonParser, async function (req, res) {
    console.log(req)
    const filter = {user_id: req.body.user_id};
    const all = await Expenses.find(filter);
    all.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
    });
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(all));
});

app.post('/getEarning', jsonParser, async function (req, res) {
    console.log(req)
    const filter = {user_id: req.body.user_id};
    const all = await Earnings.find(filter);
    all.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
    });
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(all));
});

app.post('/getTotalEarning', async function (req, res) {
    const id = new ObjectId(req.body.id);
    const all = await User.find({_id: id}, {total_earning: 1});
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(all));
});

app.post('/getTotalExpense', async function (req, res) {
    const id = new ObjectId(req.body.id);
    const all = await User.find({_id: id}, {total_expense: 1});
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(all));
});

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
    ;
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

app.post('/addCalendarEvent', jsonParser, async function (req, res) {
    try {
        const calendar = new Calendar(req.body);
        await calendar.save();
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Calendar Event');
    }
});

app.post('/addBoard', jsonParser, async function (req, res) {
    try {
        const board = new Board(req.body);
        await board.save();
        res.send('Record Saved Successfully');
    } catch (error) {
        res.send('Error While Adding Calendar Event');
    }
});

app.post('/deleteBoard', jsonParser, async function (req, res) {
    try {
        const id = new ObjectId(req.body.boardId)
        await Board.deleteOne({_id: id});
        res.send('Record Deleted Successfully');
    } catch (error) {
        res.send('Error While Deleting Calendar Event');
    }
});

app.post('/getBoard', jsonParser, async function (req, res) {
    const filter = {user_id: req.body.user_id};
    const boards = await Board.find(filter);

    const statusOrder = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

    const groupedByStatus = statusOrder.reduce((result, status) => {
        const cardsForStatus = boards
            .filter(board => board.status === status)
            .map(board => ({
                id: board._id,
                title: board.title,
                description: board.description
            }));

        result.push({
            id: result.length + 1, // You can use any unique identifier for columns
            status,
            cards: cardsForStatus
        });

        return result;
    }, []);

    res.json(groupedByStatus);
});


app.post('/changeCardStatus', jsonParser, async (req, res) => {
    const {card_id, new_status} = req.body;

    try {
        const updatedCard = await Board.findByIdAndUpdate(
            card_id,
            {$set: {status: new_status}},
            {new: true}
        );

        if (!updatedCard) {
            return res.status(404).json({message: "Card not found"});
        }

        res.json({message: "Card status updated successfully"});
    } catch (error) {
        console.error('Error updating card status:', error);
        res.status(500).json({message: "An error occurred while updating card status"});
    }
});


app.post('/getCalendarData', jsonParser, async function (req, res) {
    console.log(req)
    const filter = {user_id: req.body.user_id};
    const all = await Calendar.find(filter);
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(all));
});

app.post('/login', jsonParser, async function (req, res) {
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const filter = {email: req.body.email, password: req.body.password};
        const user = await User.findOne(filter);
        if (!user) {
            return res.status(401).send('Failure')
        } else {
            res.send({
                'message': 'Success', 'id': user.id, 'name': user.first_name,
                'earning': user.total_earning, 'expense': user.total_expense,
                'email': user.email, 'subscription_type': user.subscription_type,
                'phone_number': user.phone_number
            })
        }
    } catch (error) {
        res.send('Error While Login');
    }
});

app.get('/getPaymentMethods', jsonParser, async function (req, res) {
    // res.setHeader('content-type', 'application/json');
    // res.header("Access-Control-Allow-Origin", "*");
    const filter = {};
    const all = await PaymentMethods.find(filter);
    res.send(JSON.stringify(all));
});

app.post('/addPaymentMethod', jsonParser, async function (req, res) {
    const payment_method = new PaymentMethods(req.body);
    payment_method.save();
    res.send('Record Saved Successfully');
})

app.post('/getUserDetails', jsonParser, async function (req, res) {
    var id = new ObjectId(req.body.user_id)
    const filter = {"_id": id};
    const all = await User.find(filter, {total_earning: 1, total_expense: 1});
    res.setHeader('content-type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    ;
    res.send(JSON.stringify(all));
});


app.post('/deleteEarning', jsonParser, async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const id = new ObjectId(req.body.earning_id)
        const existingEarning = await Earnings.findOne({ _id: id});
        await Earnings.deleteOne({_id: id});
        const user = await User.findById(existingEarning.user_id);
        const new_total_earning = user.total_earning - existingEarning.amount
        await User.updateOne({_id: existingEarning.user_id}, {$set: {total_earning: new_total_earning}});
        res.send('Earning Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});

app.post('/getPieChartData', jsonParser, async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");

    try {
        const filter = {user_id: req.body.user_id};

        // Aggregate the expenses based on payment method
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

        res.send(JSON.stringify(result));
    } catch (error) {
        res.send('Could not retrieve pie chart data');
    }
});


app.post('/deleteExpense', jsonParser, async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const id = new ObjectId(req.body.expense_id)
        const existingExpense = await Expenses.findOne({ _id: id});
        await Expenses.deleteOne({_id: id});
        const user = await User.findById(existingExpense.user_id);
        const new_total_expense = user.total_expense - existingExpense.amount
        await User.updateOne({_id: existingExpense.user_id}, {$set: {total_expense: new_total_expense}});
        res.send('Expense Record Deleted Successfully');
    } catch (error) {
        req.send('Could Not Delete Earning');
    }
});

app.post('/getEarningAndExpense', jsonParser, async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const total_expense = await Expenses.aggregate([
            {$match: {user_id: req.body.user_id}},
            {$group: {_id: "$user_id", totalExpenses: {$sum: "$amount"}}}
        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });


        const total_earning = await Earnings.aggregate([
            {$match: {user_id: req.body.user_id}},
            {$group: {_id: "$user_id", totalEarning: {$sum: "$amount"}}}
        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });

        const earning = total_earning[0].totalEarning
        const expense = total_expense[0].totalExpenses

        const response = {
            earning, expense
        }
        res.send(JSON.stringify(response));

    } catch (error) {
        res.send('Could Not Get Earning And Expense');
        throw error;
    }
});

// Add this code to your existing Express app

app.get('/getExpenses', async (req, res) => {
    try {
        const {user_id, date, amount} = req.query;
        const filter = {user_id};

        if (date) {
            // Convert date to ISO format for querying
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            filter.date = {$gte: startDate, $lte: endDate};
        }

        if (amount) {
            filter.amount = parseFloat(amount);
        }

        const expenses = await Expenses.find(filter);

        res.setHeader('content-type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.send(JSON.stringify(expenses));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error While Getting Expenses');
    }
});




