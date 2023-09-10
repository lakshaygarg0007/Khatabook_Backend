const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const paymentMethodsService = require('../services/payment_method_service');

app.get('/getPaymentMethods', jsonParser, async function (req, res) {
    try {
        const all = await paymentMethodsService.getAllPaymentMethods();
        res.send(JSON.stringify(all));
    } catch (error) {
        res.status(500).send('Error fetching payment methods');
    }
});

app.post('/addPaymentMethod', jsonParser, async function (req, res) {
    try {
        await paymentMethodsService.addPaymentMethod(req.body);
        res.send('Record Saved Successfully');
    } catch (error) {
        res.status(500).send('Error saving payment method');
    }
});

