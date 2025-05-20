const jwt = require('jsonwebtoken');
const { CustomException } = require('../utils');

const verifyToken = (request, response, next) => {
    const token = request.cookies.accessToken;

    if (!token) {
        throw CustomException('You are not authenticated!', 401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            throw CustomException('Token is not valid!', 403);
        }

        request.userID = payload._id;
        request.isSeller = payload.isSeller;
        next();
    });
};

module.exports = {
    verifyToken
};
