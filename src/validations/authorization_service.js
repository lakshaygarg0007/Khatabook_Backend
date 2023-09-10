const jwt = require('jsonwebtoken')
const config = require('config.json')
const jwtKey = config.jwtKey

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Authentication required'});
    }

    jwt.verify(token.split(' ')[1], jwtKey, (err, decoded) => {
        if (decoded.userId === req.body.userId) {
            next();
        } else {
            return res.status(401).json({ message: 'User Not Authorized' });
        }
    });
}

module.exports = verifyToken;