const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config');

const authController = {
    signup: async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 8);
            const user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role || 'user'
            });

            return res.status(201).json({
                status: 'success',
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    signin: async (req, res) => {
        try {
            const user = await User.findOne({
                where: {
                    username: req.body.username
                }
            });

            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

            if (!passwordIsValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid password'
                });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                config.secret,
                { expiresIn: config.jwtExpiration }
            );

            const refreshToken = jwt.sign(
                { id: user.id },
                config.secret,
                { expiresIn: config.jwtRefreshExpiration }
            );

            return res.json({
                status: 'success',
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    accessToken: token,
                    refreshToken: refreshToken
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    refreshToken: async (req, res) => {
        try {
            const user = await User.findByPk(req.userId);
            
            const newAccessToken = jwt.sign(
                { id: user.id, role: user.role },
                config.secret,
                { expiresIn: config.jwtExpiration }
            );

            return res.json({
                status: 'success',
                data: {
                    accessToken: newAccessToken
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    changePassword: async (req, res) => {
        try {
            const user = await User.findByPk(req.userId);
            
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }

            // Validate new password
            if (!req.body.newPassword || req.body.newPassword.length < 6) {
                return res.status(400).json({
                    status: 'error',
                    message: 'New password must be at least 6 characters long'
                });
            }

            // Check if new password is different from current
            const isSamePassword = await bcrypt.compare(req.body.newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({
                    status: 'error',
                    message: 'New password must be different from current password'
                });
            }

            const passwordIsValid = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!passwordIsValid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Current password is incorrect'
                });
            }

            const hashedPassword = await bcrypt.hash(req.body.newPassword, 8);
            await user.update({ password: hashedPassword });

            return res.json({
                status: 'success',
                message: 'Password updated successfully'
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = authController;