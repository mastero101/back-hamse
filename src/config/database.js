const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();
// Importar el seeder de actividades
const defaultActivitiesSeeder = require('../seeders/default-activities');
// Importar el seeder de requerimientos
const defaultRequirementsSeeder = require('../seeders/default-requirements');
// Importar el seeder de productos
const defaultProductsSeeder = require('../seeders/default-products');

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
        // Importar el modelo Requirement
        const Requirement = require('../models/requirement.model');
        // Importar el modelo Product
        const Product = require('../models/product.model');
        // Importar el modelo AuditLog
        const AuditLog = require('../models/auditLog.model')(sequelize);

        // Sync without forcing recreation of tables
        await sequelize.sync();

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

        // Check if default requirements exist before seeding
        const requirementCount = await Requirement.count();
        if (requirementCount === 0) {
            console.log('No requirements found, seeding default requirements...');
            // Ejecutar la lógica 'up' del seeder de requerimientos
            await defaultRequirementsSeeder.up(sequelize.getQueryInterface(), Sequelize);
            console.log('Default requirements seeded successfully.');
        } else {
            console.log(`${requirementCount} requirements already exist, skipping seeding.`);
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

        // Check if default products exist before seeding
        const productCount = await Product.count();
        if (productCount === 0) {
            console.log('No products found, seeding default products...');
            await defaultProductsSeeder.up(sequelize.getQueryInterface(), Sequelize);
            console.log('Default products seeded successfully.');
        } else {
            console.log(`${productCount} products already exist, skipping seeding.`);
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