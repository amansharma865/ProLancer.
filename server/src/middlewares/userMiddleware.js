const jwt = require('jsonwebtoken');
const { CustomException } = require('../utils');

const userMiddleware = (request, response, next) => {
    const token = request.cookies.accessToken;
    
    try {
        if(!token) {
            return response.status(401).send({
                error: true,
                message: 'You are not authenticated!'
            });
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, verification) => {
            if (err) {
                return response.status(403).send({
                    error: true,
                    message: 'Token is not valid!'
                });
            }
            
            request.userID = verification._id;
            request.isSeller = verification.isSeller;
            
            next();
        });
    }
    catch(error) {
        console.error("Authentication error:", error);
        return response.status(500).send({
            error: true,
            message: 'Authentication error'
        });
    }
}

module.exports = userMiddleware;
