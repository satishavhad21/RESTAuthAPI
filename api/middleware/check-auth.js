const jwt = require('jsonwebtoken');

// this middleware is used tp check whether token provided in request is valid or not.
// If valid then go to next()function else return error
module.exports = (req, res, next) => {
    try {
        const token=req.headers.authorization.split(" ")[1];
        const key=process.env.JWT_KEY;//"secret";
        const decodedToken = jwt.verify(token, key) 
        //jwt.verify will throw exception in case of missmatch and directly catch block is executed
        req.userData = decodedToken;
        console.log("token "+ decodedToken);
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Authentication failed',
            error:error
        });
    }

}