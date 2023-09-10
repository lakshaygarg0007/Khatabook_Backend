const PaymentMethods = require("../models/payment_methods");

async function getAllPaymentMethods() {
    const filter = {};
    return PaymentMethods.find(filter);
}

async function addPaymentMethod(paymentData) {
    const payment_method = new PaymentMethods(paymentData);
    return payment_method.save();
}

module.exports = {
    getAllPaymentMethods,
    addPaymentMethod,
};
