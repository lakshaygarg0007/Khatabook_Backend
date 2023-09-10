const express = require('express');
const app = express();
const config = require('../config')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const verifyToken = require('./validations/authorization_service')

app.use(cors())
app.use(verifyToken)
app.use(bodyParser.json());

mongoose.connect(config.dbUrl, {useNewUrlParser: false});
mongoose.connection.once('open', function () {
    console.log('Database connected Successfully');
}).on('error', function (err) {
    console.log('Error', err);
});

app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`)
})


