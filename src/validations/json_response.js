const setJsonResponse =  (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    next();
}

module.exports = setJsonResponse;
