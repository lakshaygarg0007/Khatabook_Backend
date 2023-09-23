const userService = require("../services/user_service");
const express = require('express');
const router = express.Router();
const verifyToken = require("../validations/authorization_service")
const jsonResponse = require('../validations/json_response')


router.post('/signup', verifyToken, jsonResponse,  async function (req, res) {
    try {
        await userService.signup(req.body);
        res.send('User Added Successfully');
    } catch (error) {
        res.send('Error While Adding User');
    }
});

router.post('/login', verifyToken, jsonResponse, async function (req, res) {
    try {
        const userData = await userService.login(req.body);
        res.status(200).json(userData); // Send a JSON response with a 200 status code
    } catch (error) {
        res.status(401).json({ message: 'Failure', error: error.message }); // Send a JSON error response with a 401 status code
    }
});

module.exports = router;
