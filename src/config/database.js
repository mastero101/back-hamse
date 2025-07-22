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

// 👇 CONFIGURACIÓN OPTIMIZADA PARA RDS
const config = {
    dialect: 'postgres',
    dialectModule: require('pg'),
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        // 👇 TIMEOUTS ESPECÍFICOS PARA RDS
        connectTimeout: 60000, // 60 segundos para conectar
        requestTimeout: 30000, // 30 segundos para consultas
        keepAlive: true,
        keepAliveInitialDelayMillis: 0,
    },
    // 👇 CONFIGURACIÓN DE POOL CRÍTICA
    pool: {
        max: 5,          // ⬇️ MÁXIMO 5 conexiones concurrentes
        min: 1,          // ⬇️ MÍNIMO 1 conexión siempre activa
        acquire: 60000,  // ⬇️ 60 segundos máximo para obtener conexión
        idle: 30000,     // ⬇️ 30 segundos antes de cerrar conexión inactiva
        evict: 60000,    // ⬇️ 60 segundos para verificar conexiones
        handleDisconnects: true
    },
    // 👇 CONFIGURACIÓN ADICIONAL PARA ESTABILIDAD
    retry: {
        max: 3,          // Máximo 3 reintentos
        match: [         // Reintentar en estos errores
            /ConnectionError/,
            /ConnectionRefusedError/,
            /ConnectionTimedOutError/,
            /TimeoutError/,
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/
        ]
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false, // Solo logs en desarrollo
    benchmark: false // Deshabilitar benchmark para mejor performance
};

const sequelize = new Sequelize(dbUrl, config);

// 👇 AGREGAR MANEJO DE EVENTOS DE CONEXIÓN
sequelize.addHook('beforeConnect', (config) => {
    console.log('Attempting to connect to database...');
});

sequelize.addHook('afterConnect', (connection, config) => {
    console.log('Successfully connected to database');
});

sequelize.addHook('beforeDisconnect', (connection) => {
    console.log('Disconnecting from database...');
});

// 👇 FUNCIÓN PARA VERIFICAR ESTADO DE CONEXIONES
const checkConnectionHealth = async () => {
    try {
        await sequelize.authenticate();
        const poolInfo = sequelize.connectionManager.pool;
        console.log(`Pool status - Active: ${poolInfo.used}/${poolInfo.size}, Waiting: ${poolInfo.pending}`);
        return true;
    } catch (error) {
        console.error('Database connection health check failed:', error.message);
        return false;
    }
};

const initializeDatabase = async () => {
    try {
        // 👇 VERIFICAR CONEXIÓN CON TIMEOUT
        console.log('Initializing database connection...');
        const connectionTimeout = setTimeout(() => {
            throw new Error('Database connection timeout after 60 seconds');
        }, 60000);

        await sequelize.authenticate();
        clearTimeout(connectionTimeout);
        
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

        // 👇 SYNC CON MANEJO DE ERRORES MEJORADO
        console.log('Synchronizing database models...');
        await sequelize.sync({ 
            logging: false,
            retry: {
                max: 3,
                timeout: 30000
            }
        });

        // Check if admin exists before creating
        const adminExists = await User.findOne({ 
            where: { username: 'admin' },
            timeout: 10000 // 10 segundos timeout para esta consulta
        });

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

        // 👇 VERIFICAR ESTADO FINAL DEL POOL
        await checkConnectionHealth();
        
        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Unable to initialize database:', error);
        
        // 👇 INTENTAR CERRAR CONEXIONES EN CASO DE ERROR
        try {
            await sequelize.close();
            console.log('Database connections closed due to initialization error.');
        } catch (closeError) {
            console.error('Error closing database connections:', closeError);
        }
        
        throw error; // Re-lanzar el error para que la aplicación falle si la inicialización no es exitosa
    }
};

// 👇 FUNCIÓN PARA CERRAR CONEXIONES GRACEFULLY
const closeDatabase = async () => {
    try {
        await sequelize.close();
        console.log('Database connections closed successfully.');
    } catch (error) {
        console.error('Error closing database connections:', error);
    }
};

// 👇 MANEJAR CIERRE GRACEFUL DE LA APLICACIÓN
process.on('SIGINT', async () => {
    console.log('Received SIGINT, closing database connections...');
    await closeDatabase();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, closing database connections...');
    await closeDatabase();
    process.exit(0);
});

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
    initializeDatabase,
    closeDatabase,
    checkConnectionHealth
};