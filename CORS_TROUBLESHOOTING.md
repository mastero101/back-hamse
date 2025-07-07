# Solución de Problemas de CORS

## Configuración Actual

El backend está configurado con CORS para permitir requests desde los siguientes orígenes:

- `http://localhost:4200` (Angular dev server)
- `http://localhost:3000` (Puerto alternativo)
- `http://127.0.0.1:4200` (IP local)
- `http://127.0.0.1:3000` (IP local alternativo)
- `https://front-hamse.vercel.app` (Frontend en Vercel)
- `https://hamse.vercel.app` (Dominio alternativo)
- `https://hamse.mx` (Dominio principal)
- `https://www.hamse.mx` (Dominio principal con www)

## Verificar Configuración

### 1. Probar endpoint de CORS
```bash
npm run test-cors
```

### 2. Probar manualmente desde el navegador
Abre la consola del navegador y ejecuta:
```javascript
fetch('https://back-hamse.vercel.app/api/test-cors', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### 3. Verificar logs del servidor
Los logs mostrarán:
- Origen de la request
- Método HTTP
- User-Agent
- Timestamp

## Problemas Comunes y Soluciones

### 1. Error: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solución:**
- Verificar que el origen esté en la lista de `allowedOrigins` en `src/config/cors.config.js`
- Agregar el nuevo origen a la lista si es necesario

### 2. Error: "Request header field Authorization is not allowed by Access-Control-Allow-Headers"

**Solución:**
- Verificar que 'Authorization' esté en `allowedHeaders` en la configuración de CORS
- Ya está incluido en la configuración actual

### 3. Error: "Response to preflight request doesn't pass access control check"

**Solución:**
- Verificar que el servidor responda correctamente a requests OPTIONS
- La configuración actual maneja preflight requests automáticamente

### 4. Problemas con Vercel

**Solución:**
- Verificar que `vercel.json` tenga los headers correctos
- Hacer deploy nuevamente después de cambios en `vercel.json`

## Agregar Nuevo Origen

Para agregar un nuevo origen permitido:

1. Editar `src/config/cors.config.js`
2. Agregar el nuevo origen a `allowedOrigins`
3. Reiniciar el servidor
4. Hacer deploy si es necesario

```javascript
const allowedOrigins = [
  // ... orígenes existentes
  'https://nuevo-dominio.com'  // Agregar aquí
];
```

## Debugging

### Logs del Servidor
El servidor registra todas las requests con:
- Método HTTP
- Ruta
- Origen
- User-Agent
- Timestamp

### Headers de Respuesta
Verificar que las respuestas incluyan:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

### Herramientas de Desarrollo
- Usar las herramientas de desarrollo del navegador (F12)
- Revisar la pestaña Network para ver requests fallidas
- Verificar la pestaña Console para errores de CORS

## Configuración de Producción

En producción, considera:
- Limitar orígenes a solo los necesarios
- Usar HTTPS para todos los orígenes
- Configurar `credentials: true` solo si es necesario
- Implementar rate limiting para requests OPTIONS

## Contacto

Si persisten los problemas de CORS, verificar:
1. Logs del servidor
2. Configuración de Vercel
3. Headers de respuesta
4. Origen de las requests 