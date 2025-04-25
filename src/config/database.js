const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL.includes('hamse') 
    ? process.env.DATABASE_URL 
    : `${process.env.DATABASE_URL.replace(/\/[^/]*$/, '')}/hamse`;

const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectModule: require('pg'),  // Añadimos esta línea
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');

        // Import models
        const User = require('../models/user.model');
        const Activity = require('../models/activity.model');
        const Schedule = require('../models/schedule.model');
        const Status = require('../models/status.model');
        const Report = require('../models/report.model');

        // Sync without forcing recreation of tables
        await sequelize.sync({ force: false, alter: true });
        
        // Check if admin exists before creating
        const adminExists = await User.findOne({ where: { username: 'admin' } });
        
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 8);
            await User.create({
                username: 'admin',
                email: 'admin@hamse.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Default admin user created.');
        }

        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to initialize database:', error);
        throw error;
    }
};

module.exports = { sequelize, Sequelize, initializeDatabase };