const jwt = require('jsonwebtoken');
const {JWT_SIGNATURE_KEY = "RAHASIA"} = process.env;

module.exports = function(req, res, next) {
    try {
        const payload = jwt.verify(req.headers["authorization"].split(' ')[1], JWT_SIGNATURE_KEY);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({
            status: "FAIL",
            data: {
                name: "BELUM LOGIN",
                message: err.message
            }
        })
    }
}