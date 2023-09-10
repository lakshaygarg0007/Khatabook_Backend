const stockService = require("../services/stock_service")

app.post('/getStocksData', jsonParser, async function (req, res) {
    try {
        const stockData = await stockService.getStocksData(req.body.user_id)
        res.send(stockData)
    } catch (error) {
        res.send("Error While Fetching Stock Data")
    }
});

app.post('/getTotalStockValue', jsonParser, async function (req, res) {
   try {
       const stockVal = await stockService.getTotalStockValue(req.body.user_id);
       res.send(stockVal)
   } catch (error) {
       res.send("Error While Fetching Total Stock Value")
   }
});