const jwt = require('jsonwebtoken');
const {JWT_SIGNATURE_KEY = "RAHASIA"} = process.env;

module.exports = function(req, res, next) {
    const id = Number(req.params.id);
    const payload = jwt.verify(req.headers["authorization"].split(' ')[1], JWT_SIGNATURE_KEY);
    req.user = payload;
    console.log(id, req.user.id);
    if(id === req.user.id) return next();

    res.status(403).json({
        status: "FAIL",
        data: {
            name: "FORBIDDEN",
            message: "this is not your account!"
        }
    })
   
}