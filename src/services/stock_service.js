const Stock = require("../models/stocks");
const {ObjectId} = require("mongodb");

async function getStocksData(userId) {
    const filter = {user_id: userId};
    return Stock.find(filter);
}

async function getTotalStockValue(userId){
    const id = new ObjectId(userId);
    const userStockRecords = await Stock.find({ user_id: id });
    return userStockRecords.reduce((total, stock) => total + parseFloat(stock.purchase_rate), 0)
}

module.exports = {
    getStocksData,
    getTotalStockValue
}
