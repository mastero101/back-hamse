const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();
// Importar el seeder de actividades
const defaultActivitiesSeeder = require('../seeders/default-activities');

const dbUrl = process.env.DATABASE_URL.includes('hamse') 
    ? process.env.DATABASE_URL 
    : `${process.env.DATABASE_URL.replace(/\/[^/]*$/, '')}/hamse`;

const config = {
    dialect: 'postgres',
    dialectModule: require('pg'),
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
};

const sequelize = new Sequelize(dbUrl, config);

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
        const Setting = require('../models/setting.model');

        // Sync without forcing recreation of tables
        await sequelize.sync({ force: false, alter: true });
        console.log('Database models synchronized.');

        // Check if admin exists before creating
        const adminExists = await User.findOne({ where: { username: 'admin' } });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin1', 8);
            await User.create({
                username: 'admin',
                email: 'admin@hamse.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Default admin user created.');
        } else {
            console.log('Admin user already exists.');
        }

        // Check if default activities exist before seeding
        const activityCount = await Activity.count();
        if (activityCount === 0) {
            console.log('No activities found, seeding default activities...');
            // Ejecutar la lógica 'up' del seeder
            // Pasamos sequelize.getQueryInterface() y Sequelize como argumentos
            await defaultActivitiesSeeder.up(sequelize.getQueryInterface(), Sequelize);
            console.log('Default activities seeded successfully.');
        } else {
            console.log(`${activityCount} activities already exist, skipping seeding.`);
        }

        // Crear configuración por defecto para WhatsApp si no existe
        const whatsappSetting = await Setting.findByPk('whatsappNumber');
        if (!whatsappSetting) {
            await Setting.create({
                key: 'whatsappNumber',
                value: process.env.DEFAULT_WHATSAPP_NUMBER || '+1234567890' // Usa una variable de entorno o un valor por defecto seguro
            });
            console.log('Default WhatsApp number setting created.');
        } else {
            console.log('WhatsApp number setting already exists.');
        }


        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Unable to initialize database:', error);
        throw error; // Re-lanzar el error para que la aplicación falle si la inicialización no es exitosa
    }
};

// Añadir esta configuración para las migraciones
module.exports = {
    development: {
        ...config,
        url: dbUrl
    },
    test: {
        ...config,
        url: dbUrl
    },
    production: {
        ...config,
        url: dbUrl
    },
    sequelize,
    Sequelize,
    initializeDatabase
};