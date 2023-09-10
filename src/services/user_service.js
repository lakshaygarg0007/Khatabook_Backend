const User = require('../models/users');
const CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config.json")

async function signup(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        return {
            statusCode: 400,
            message: 'Email already exists',
        };
    }
    const decryptedPassword =  CryptoJS.AES.decrypt(userData.password, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8)
    bcrypt.hash(decryptedPassword, config.saltRounds, async (err, hashedPassword) => {
        if (err) {
            res.status(500).json({ error: 'Error While Signup' });
        } else {
            const user = new User({
                first_name: userData.first_name,
                email: userData.email,
                password: hashedPassword
            });

            await user.save();
        }
    });

    return { message: 'Successfully Signed Up' };
}

async function login(loginData) {
    const decryptedPassword =  CryptoJS.AES.decrypt(loginData.password, config.encryptionSecretKey).toString(CryptoJS.enc.Utf8)
    const user = await User.findOne({ email: loginData.email});
    if (!user) {
        return {
            statusCode: 401,
            message: 'User Not Found',
        };
    }
    bcrypt.compare(decryptedPassword, user.password, (err, result) => {
        if (err) {
            return {
                statusCode: 401,
                message: 'User already exists',
            };
        } else if (result) {
            const id = user.id
            const tokenVal = jwt.sign({user_id : user.id}, jwtKey, { expiresIn: '1hr' });
            return json({
                'message': 'Success', 'id': user.id, 'name': user.first_name,
                'earning': user.total_earning, 'expense': user.total_expense,
                'email': user.email, 'subscription_type': user.subscription_type,
                'phone_number': user.phone_number, token: tokenVal
            });
        } else {
            return {
                statusCode: 400,
                message: 'Error While Login',
            };
        }
    });
}

module.exports = {
    signup,
    login
};