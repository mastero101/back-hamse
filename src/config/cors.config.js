const cors = require('cors');

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:4200',           // Angular dev server
      'http://localhost:3000',           // Puerto alternativo
      'http://127.0.0.1:4200',          // IP local
      'http://127.0.0.1:3000',          // IP local alternativo
      'https://front-hamse.vercel.app',  // Frontend en Vercel
      'https://hamse.vercel.app',        // Dominio alternativo
      'https://hamse.mx',                // Dominio principal
      'https://www.hamse.mx',            // Dominio principal con www
      undefined                          // Permitir requests sin origin (como Postman)
    ];

    // Permitir requests sin origin o con origin en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,                   // Permitir cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-API-Key'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,                       // Cache preflight por 24 horas
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Middleware personalizado para CORS
const corsMiddleware = (req, res, next) => {
  // Headers adicionales para CORS
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, X-API-Key');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
};

module.exports = {
  corsOptions,
  corsMiddleware
}; 