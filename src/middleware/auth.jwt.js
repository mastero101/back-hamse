const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.secret);
        const user = await User.findByPk(decoded.id);
        
        if (!user) {
            return res.status(403).json({
                status: 'error',
                message: 'User not found'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized!'
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Require Admin Role!'
        });
    }
    next();
};

const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({
            status: 'error',
            message: 'Refresh Token is required!'
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, config.secret);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid Refresh Token!'
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    verifyRefreshToken
};