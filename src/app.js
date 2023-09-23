const express = require('express');
const app = express();
const config = require('./config.json');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userController = require('./controller/user_controller');
const boardController = require('./controller/board_controller');
const calendarController = require('./controller/calendar_controller');
const pieChartController = require('./controller/piechart_controller');
const subscriptionController = require('./controller/subscription_controller')
const earningController = require('./controller/earning_controller')
const expenseController = require('./controller/expense_controller')
const stockController = require('./controller/stock_controller')

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(config.dbUrl, { useNewUrlParser: false });
mongoose.connection.once('open', function () {
    console.log('Database connected Successfully');
}).on('error', function (err) {
    console.log('Error', err);
});

app.use('/', userController)
app.use('/', boardController)
app.use('/', calendarController)
app.use('/', pieChartController)
app.use('/', subscriptionController)
app.use('/', earningController)
app.use('/', expenseController)
app.use('/', stockController)

app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
});

module.exports = app;
