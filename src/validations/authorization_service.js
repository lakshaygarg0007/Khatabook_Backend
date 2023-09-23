const jwt = require('jsonwebtoken')
//const config = require('config.json')
const jwtKey = "e24ceXbMzPpooxsVdzB14YrEB5rDGPr9";

//const excludedRoutes = ['/login'];

const verifyToken = (req, res, next) => {
    // if (excludedRoutes.includes(req.path)) {
    //     return next();
    // }

    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authentication required'});
    }

    jwt.verify(token.split(' ')[1], jwtKey, (err, decoded) => {
        if (decoded.user_id === req.body.user_id) {
            next();
        } else {
            return res.status(401).json({ message: 'User Not Authorized' });
        }
    });
}

module.exports = verifyToken;