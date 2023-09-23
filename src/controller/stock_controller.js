const stockService = require("../services/stock_service")
const express = require('express');
const {verify} = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require('../validations/authorization_service')
const jsonResponse = require('../validations/json_response')

router.post('/getStocksData',  verifyToken, jsonResponse, async function (req, res) {
    try {
        const stockData = await stockService.getStocksData(req.body.user_id)
        res.send(stockData)
    } catch (error) {
        res.status("Error While Fetching Stock Data")
    }
});

router.post('/getTotalStockValue', verifyToken, jsonResponse, async function (req, res) {
   try {
       const stockVal = await stockService.getTotalStockValue(req.body.user_id);
       res.send(JSON.stringify(stockVal))
   } catch (error) {
       res.send("Error While Fetching Total Stock Value")
   }
});

module.exports = router;