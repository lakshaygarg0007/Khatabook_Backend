const express = require('express');
const app = express();
const port = 8000;
const data = require('./data');
const mongoose = require('mongoose');
const Earnings = require('./models/earnings');
var bodyParser = require('body-parser');
var cors = require('cors');
const User = require('./models/users');
const Expenses = require('./models/expenses');
const PaymentMethods = require('./models/payment_methods');
const parser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");;
  res.send(JSON.stringify(data.data));
});

mongoose.connect('mongodb+srv://lakshaygarg:hmtQHahi3aZR2P7T@cluster0.sqbda3w.mongodb.net/test', { useNewUrlParser: false });
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
  all.sort(function (a, b) { return new Date(b.date) - new Date(a.date) });
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");;
  res.send(JSON.stringify(all));
});

var jsonParser = parser.json()

app.post('/addEarning', jsonParser, async function (req, res) {
  try {
    console.log(req.body);
    var earning = new Earnings(req.body);
    var id = new ObjectId(req.body.user_id)
    const user = await User.find({ _id: id });
    await User.updateOne({ _id: id }, { $set: { total_earning: parseFloat(user[0].total_earning) + req.body.amount } });
    earning.save();
    res.send('Record Saved Successfully');
  } catch (error) {
    res.send('Error While Adding Earning');
  }
});

//const ObjectId = require('mongoose').Types.ObjectId;

app.post('/UpdateEarning', jsonParser, async function (req, res) {
  try {
    console.log(req.body);
    const earning_id = new ObjectId(req.body.earning_Id);
    const new_earning = req.body.amount;
    console.log(earning_id);

    const existingEarning = await Earnings.find({ _id: earning_id });
    debugg;
    console.log(existingEarning);
    if (!existingEarning) {
      return res.status(404).send('Earning not found');
    }


    const user_id = new ObjectId(existingEarning.user_id);
    debugg;

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).send('User not found');
    }


    const previous_earning = existingEarning.amount;
    const earning_difference = new_earning - previous_earning;


    const updated_total_earning = user.total_earning + earning_difference;
    await User.updateOne({ _id: ObjectId(user_id) }, { $set: { total_earning: updated_total_earning } });


    existingEarning.amount = new_earning;
    await existingEarning.save();

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
    const user = await User.find({ _id: id });
    console.log(user[0].total_expense)
    await User.updateOne({ _id: id }, { $set: { total_expense: parseFloat(user[0].total_expense) + req.body.amount } });
    expense.save();
    res.send('Record Saved Successfully');
  } catch (error) {
    res.send('Error While Adding Expense');
  }
});


app.post('/getExpense', jsonParser, async function (req, res) {
  console.log(req)
  const filter = { user_id: req.body.user_id };
  const all = await Expenses.find(filter);
  all.sort(function (a, b) { return new Date(b.date) - new Date(a.date) });
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");;
  res.send(JSON.stringify(all));
});

app.post('/getEarning', jsonParser, async function (req, res) {
  console.log(req)
  const filter = { user_id: req.body.user_id };
  const all = await Earnings.find(filter);
  all.sort(function (a, b) { return new Date(b.date) - new Date(a.date) });
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");;
  res.send(JSON.stringify(all));
});

app.post('/getTotalEarning', async function (req, res) {
  const id = new ObjectId(req.body.id);
  const all = await User.find({ _id: id }, { total_earning: 1});
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");;
  res.send(JSON.stringify(all));
});

app.post('/getTotalExpense', async function (req, res) {
  const id = new ObjectId(req.body.id);
  const all = await User.find({ _id: id }, {total_expense: 1 });
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");;
  res.send(JSON.stringify(all));
});

app.post('/login', jsonParser, async function (req, res) {
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const filter = { email: req.body.email, password: req.body.password };
    const user = await User.findOne(filter);
    if (!user) {
      return res.status(401).send('Failure')
    } else {
      res.send({ 'message': 'Success', 'id': user.id, 'name': user.first_name, 'earning': user.total_earning, 'expense': user.total_expense })
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
  const filter = { "_id": id };
  const all = await User.find(filter, { total_earning: 1, total_expense: 1 });
  res.setHeader('content-type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");;
  res.send(JSON.stringify(all));
});


app.post('/deleteEarning', jsonParser, async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  try {
    var id = new ObjectId(req.body.earning_id)
    await Earnings.deleteOne({ _id: id });
    res.send('Earning Record Deleted Successfully');

  } catch (error) {
    req.send('Could Not Delete Earning');
  }
});

app.post('/getPieChartData', jsonParser, async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");

  try {
    const filter = { user_id: req.body.user_id };

    // Aggregate the expenses based on payment method
    const aggregationPipeline = [
      { $match: filter },
      {
        $group: {
          _id: "$payment_method",
          amount: { $sum: "$amount" }
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
    var id = new ObjectId(req.body.expense_id)
    await Expenses.deleteOne({ _id: id });
    res.send('Expense Record Deleted Successfully');

  } catch (error) {
    req.send('Could Not Delete Earning');
  }
});

app.post('/getEarningAndExpense', jsonParser, async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const total_expense = await Expenses.aggregate([
      {$match: { user_id: req.body.user_id }},
      { $group: { _id: "$user_id", totalExpenses: { $sum: "$amount" } } }
  ], function (err, result) {
      if (err) {
          console.log(err);
          return;
      }
    });



  const total_earning = await Earnings.aggregate([
      {$match: { user_id: req.body.user_id }},
      { $group: { _id: "$user_id", totalEarning: { $sum: "$amount" } } }
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

