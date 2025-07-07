const axios = require('axios');

// URLs de prueba
const testUrls = [
  'https://back-hamse.vercel.app/api/test-cors',
  'http://localhost:3000/api/test-cors'
];

async function testCORS() {
  console.log('🧪 Probando configuración de CORS...\n');

  for (const url of testUrls) {
    try {
      console.log(`📡 Probando: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'Origin': 'https://front-hamse.vercel.app',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log(`✅ Éxito: ${response.status} - ${response.data.message}`);
      console.log(`   Origin recibido: ${response.data.origin}`);
      console.log(`   Timestamp: ${response.data.timestamp}\n`);

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Headers:`, error.response.headers);
        console.log(`   Data:`, error.response.data);
      }
      
      console.log('');
    }
  }

  console.log('🔍 Prueba de preflight OPTIONS...\n');

  for (const url of testUrls) {
    try {
      console.log(`📡 Probando OPTIONS: ${url}`);
      
      const response = await axios.options(url, {
        headers: {
          'Origin': 'https://front-hamse.vercel.app',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        },
        timeout: 10000
      });

      console.log(`✅ OPTIONS exitoso: ${response.status}`);
      console.log(`   Headers CORS:`, {
        'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': response.headers['access-control-allow-headers'],
        'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials']
      });
      console.log('');

    } catch (error) {
      console.log(`❌ Error OPTIONS: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Headers:`, error.response.headers);
      }
      console.log('');
    }
  }
}

// Ejecutar prueba
testCORS().catch(console.error); 