const paymentMethodsService = require('../services/payment_method_service');
const express = require('express');
const router = express.Router();
const verifyToken = require("../validations/authorization_service")
const jsonResponse = require('../validations/json_response')

router.get('/getPaymentMethods',  verifyToken, jsonResponse, async function (req, res) {
    try {
        const all = await paymentMethodsService.getAllPaymentMethods();
        res.send(JSON.stringify(all));
    } catch (error) {
        res.status(500).send('Error fetching payment methods');
    }
});

router.post('/addPaymentMethod', verifyToken, jsonResponse, async function (req, res) {
    try {
        await paymentMethodsService.addPaymentMethod(req.body);
        res.send('Record Saved Successfully');
    } catch (error) {
        res.status(500).send('Error saving payment method');
    }
});

module.exports = router;

