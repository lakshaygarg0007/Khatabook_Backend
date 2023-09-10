const userService = require("../services/user_service");

app.post('/signup', jsonParser, async function (req, res) {
    try {
        await userService.signup(req.body)
        res.send('User Added Successfully');
    } catch (error) {
        res.send('Error While Adding User');
    }
});

app.post('/login', jsonParser, async function (req, res) {
    try {
        await userService.login(req.body)
        res.send('Login Successfully');
    } catch (error) {
        res.send(error);
    }
});