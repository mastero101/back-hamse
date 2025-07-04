const express = require('express');
const cors = require('cors');
const os = require('os');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { sequelize, initializeDatabase } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Import routes
const authRoutes = require('./routes/auth.routes');
const activityRoutes = require('./routes/activity.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const reportRoutes = require('./routes/report.routes');
const settingsRoutes = require('./routes/settings.routes');
const requirementRoutes = require('./routes/requirement.routes');
const productRoutes = require('./routes/product.routes');
const uploadRoutes = require('./routes/upload.routes');

// Routes
// Función para obtener el uso de memoria
const getMemoryUsage = () => {
    const used = process.memoryUsage();
    return Math.round(used.heapUsed / 1024 / 1024 * 100) / 100;
};

// Ruta principal mejorada con estado del servidor y página HTML
app.get('/', async (req, res) => {
    try {
        const dbStatus = await sequelize.authenticate()
            .then(() => 'Conectado')
            .catch(() => 'Desconectado');

        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const statusData = {
            title: 'Sistema de Inventario - Estado del Servidor',
            sistemaOperativo: {
                status: 'active',
                platform: process.platform,
                version: process.version
            },
            tiempoDeActividad: {
                formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`
            },
            memoriaUtilizada: {
                value: getMemoryUsage(),
                unit: 'MB',
                total: Math.round(os.totalmem() / (1024 * 1024)),
                free: Math.round(os.freemem() / (1024 * 1024))
            },
            entorno: process.env.NODE_ENV || 'Production',
            puerto: process.env.PORT || 3000,
            database: {
                status: dbStatus,
                name: 'PostgreSQL',
                version: '15.x'
            }
        };

        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${statusData.title}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                <style>
                    :root {
                        --primary: #2563eb;
                        --success: #22c55e;
                        --danger: #ef4444;
                        --gray-100: #f3f4f6;
                        --gray-200: #e5e7eb;
                        --gray-700: #374151;
                        --gray-900: #111827;
                    }
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Inter', sans-serif;
                        background-color: var(--gray-100);
                        color: var(--gray-900);
                        line-height: 1.5;
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 2rem auto;
                        padding: 0 1rem;
                    }
                    
                    .dashboard {
                        background: white;
                        border-radius: 1rem;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                        padding: 2rem;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 2rem;
                        padding-bottom: 1rem;
                        border-bottom: 2px solid var(--gray-200);
                    }
                    
                    .header h1 {
                        font-size: 1.875rem;
                        font-weight: 600;
                        color: var(--gray-900);
                    }
                    
                    .status-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 1.5rem;
                    }
                    
                    .status-card {
                        background: var(--gray-100);
                        border-radius: 0.75rem;
                        padding: 1.5rem;
                        position: relative;
                        transition: transform 0.2s;
                    }
                    
                    .status-card:hover {
                        transform: translateY(-2px);
                    }
                    
                    .status-card h2 {
                        font-size: 1.25rem;
                        font-weight: 500;
                        color: var(--gray-700);
                        margin-bottom: 1rem;
                    }
                    
                    .status-indicator {
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        width: 0.75rem;
                        height: 0.75rem;
                        border-radius: 50%;
                        background: var(--danger);
                    }
                    
                    .status-indicator.active {
                        background: var(--success);
                    }
                    
                    .memory-bar {
                        width: 100%;
                        height: 0.5rem;
                        background: var(--gray-200);
                        border-radius: 0.25rem;
                        margin: 1rem 0;
                        overflow: hidden;
                    }
                    
                    .memory-progress {
                        height: 100%;
                        background: var(--primary);
                        border-radius: 0.25rem;
                        transition: width 0.3s ease;
                    }
                    
                    .memory-stats {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.875rem;
                        color: var(--gray-700);
                    }
                    
                    .update-info {
                        margin-top: 2rem;
                        text-align: center;
                        color: var(--gray-700);
                    }
                    
                    .btn-update {
                        background: var(--primary);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.2s;
                        margin-top: 1rem;
                    }
                    
                    .btn-update:hover {
                        background: #1d4ed8;
                    }
                    
                    @media (max-width: 640px) {
                        .container {
                            margin: 1rem auto;
                        }
                        
                        .dashboard {
                            padding: 1rem;
                        }
                        
                        .status-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="dashboard">
                        <div class="header">
                            <h1>${statusData.title}</h1>
                        </div>
                        
                        <div class="status-grid">
                            <div class="status-card">
                                <div class="status-indicator ${statusData.sistemaOperativo.status === 'active' ? 'active' : ''}"></div>
                                <h2>Sistema Operativo</h2>
                                <p>${statusData.sistemaOperativo.platform} (${statusData.sistemaOperativo.version})</p>
                            </div>

                            <div class="status-card">
                                <h2>Tiempo de Actividad</h2>
                                <p>${statusData.tiempoDeActividad.formatted}</p>
                            </div>

                            <div class="status-card">
                                <h2>Memoria</h2>
                                <div class="memory-bar">
                                    <div class="memory-progress" style="width: ${(statusData.memoriaUtilizada.value / statusData.memoriaUtilizada.total) * 100}%"></div>
                                </div>
                                <div class="memory-stats">
                                    <span>Usado: ${statusData.memoriaUtilizada.value} ${statusData.memoriaUtilizada.unit}</span>
                                    <span>Total: ${statusData.memoriaUtilizada.total} ${statusData.memoriaUtilizada.unit}</span>
                                </div>
                                <p>Libre: ${statusData.memoriaUtilizada.free} ${statusData.memoriaUtilizada.unit}</p>
                            </div>

                            <div class="status-card">
                                <h2>Entorno</h2>
                                <p>${statusData.entorno}</p>
                            </div>

                            <div class="status-card">
                                <h2>Puerto</h2>
                                <p>${statusData.puerto}</p>
                            </div>

                            <div class="status-card">
                                <div class="status-indicator ${statusData.database.status === 'Conectado' ? 'active' : ''}"></div>
                                <h2>Base de Datos</h2>
                                <p>${statusData.database.name} v${statusData.database.version}</p>
                                <p>Estado: ${statusData.database.status}</p>
                            </div>
                        </div>

                        <div class="update-info">
                            <p>Última actualización: ${new Date().toLocaleString()}</p>
                            <button class="btn-update" onclick="location.reload()">Actualizar</button>
                        </div>
                    </div>
                </div>

                <script>
                    // Actualización automática cada 30 segundos
                    setInterval(() => {
                        location.reload();
                    }, 30000);

                    // Animación suave al cargar
                    document.addEventListener('DOMContentLoaded', () => {
                        document.querySelector('.dashboard').style.opacity = '0';
                        setTimeout(() => {
                            document.querySelector('.dashboard').style.opacity = '1';
                            document.querySelector('.dashboard').style.transition = 'opacity 0.3s ease';
                        }, 100);
                    });
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Error</title>
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background-color: #f3f4f6;
                    }
                    .error-container {
                        background: white;
                        padding: 2rem;
                        border-radius: 0.75rem;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                        text-align: center;
                    }
                    h1 { color: #ef4444; }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <h1>Error al obtener el estado del servidor</h1>
                    <p>${error.message}</p>
                </div>
            </body>
            </html>
        `);
    }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();