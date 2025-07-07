const { initializeDatabase } = require('../src/config/database');
const app = require('../src/app');

// Inicializar la base de datos cuando se carga el módulo
let isInitialized = false;

const initializeApp = async () => {
    if (!isInitialized) {
        try {
            await initializeDatabase();
            console.log('Database initialized successfully for Vercel');
            isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    }
};

// Inicializar inmediatamente
initializeApp();

// Exportar la app para Vercel
module.exports = app; 