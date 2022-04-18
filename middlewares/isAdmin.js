module.exports = function(req, res, next){
    if(req.user.role === 'admin') return next();

    res.status(403).json({
        status: "FAIL",
        data: {
            name: "FORBIDDEN",
            message: "you cannot access this!"
        }
    })
}