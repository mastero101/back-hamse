# HAMSE - Sistema de Gestión de Mantenimiento
## Descripción
HAMSE es un sistema de gestión de mantenimiento que permite administrar y dar seguimiento a actividades de mantenimiento programadas. El sistema está diseñado para facilitar la planificación, ejecución y monitoreo de tareas de mantenimiento.

## Características Principales
- Gestión de usuarios con roles (admin/user)
- Autenticación JWT con refresh tokens
- Programación de actividades de mantenimiento
- Seguimiento de estado y progreso
- Generación de reportes
- API RESTful documentada con Swagger
## Tecnologías Utilizadas
- Node.js
- Express.js
- PostgreSQL (NeonDB)
- Sequelize ORM
- JWT para autenticación
- Swagger para documentación de API
## Requisitos Previos
- Node.js (v20.11.1 o superior)
- PostgreSQL
- npm o yarn
## Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/mastero101/back-hamse.git
cd back-hamse
 ```

2. Instalar dependencias:
```bash
npm install
 ```

3. Configurar variables de entorno:

Crea un archivo `.env` en la raíz del proyecto backend con el siguiente formato y ajusta los valores según tu entorno:

```
DATABASE_URL=postgres://usuario:contraseña@host:puerto/nombre_basedatos
PORT=1072
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
```

- **DATABASE_URL**: Cadena de conexión a tu base de datos PostgreSQL. Ejemplo:
  - `postgres://miusuario:miclave@localhost:5432/hamse`
- **PORT**: Puerto donde se ejecutará el backend (por defecto 1072).
- **AWS_ACCESS_KEY_ID**, **AWS_SECRET_ACCESS_KEY**, **AWS_REGION**, **AWS_S3_BUCKET**: Solo si usas almacenamiento en AWS S3, de lo contrario puedes dejarlas vacías.

4. Iniciar el servidor:
```bash
npm run dev 
nodemon
 ```

## Estructura del Proyecto
```plaintext
back-hamse/
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── auth.config.js
│   │   ├── cors.config.js
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── activity.controller.js
│   │   ├── auditLog.controller.js
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── report.controller.js
│   │   ├── requirement.controller.js
│   │   ├── schedule.controller.js
│   │   ├── settings.controller.js
│   │   ├── upload.controller.js
│   │   └── userRequirement.controller.js
│   ├── middleware/
│   │   ├── auth.jwt.js
│   │   └── validate.js
│   ├── migrations/
│   ├── models/
│   │   ├── activity.model.js
│   │   ├── activitySchedule.model.js
│   │   ├── auditLog.model.js
│   │   ├── index.js
│   │   ├── product.model.js
│   │   ├── report.model.js
│   │   ├── requirement.model.js
│   │   ├── schedule.model.js
│   │   ├── setting.model.js
│   │   ├── status.model.js
│   │   ├── user.model.js
│   │   └── userRequirement.model.js
│   ├── routes/
│   │   ├── activity.routes.js
│   │   ├── auditLog.routes.js
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── report.routes.js
│   │   ├── requirement.routes.js
│   │   ├── schedule.routes.js
│   │   ├── settings.routes.js
│   │   ├── upload.routes.js
│   │   └── userRequirement.routes.js
│   ├── scripts/
│   ├── seeders/
│   └── test-cors.js
├── package.json
├── README.md
└── vercel.json
 ```

## API Endpoints
### Autenticación
- POST /api/auth/signin - Iniciar sesión
- POST /api/auth/signup - Registrar usuario (solo admin)
- POST /api/auth/refresh-token - Renovar token
- POST /api/auth/change-password - Cambiar contraseña

### Usuarios y roles
- GET /api/users - Listar usuarios (solo admin)
- GET /api/users/:id - Obtener usuario por ID (solo admin)
- PUT /api/users/:id - Actualizar usuario (solo admin)
- DELETE /api/users/:id - Eliminar usuario (solo admin)

### Productos
- GET /api/products - Listar productos
- GET /api/products/:id - Obtener producto por ID
- POST /api/products - Crear producto (solo admin)
- PUT /api/products/:id - Actualizar producto (solo admin)
- DELETE /api/products/:id - Eliminar producto (solo admin)
- POST /api/products/sync-prices - Sincronizar precios desde API externa (solo admin)

### Actividades
- GET /api/activities - Listar actividades
- POST /api/activities - Crear actividad (solo admin)
- GET /api/activities/:id - Obtener actividad
- PUT /api/activities/:id - Actualizar actividad (solo admin)
- DELETE /api/activities/:id - Eliminar actividad (solo admin)

### Programación de mantenimiento (Schedules)
- GET /api/schedules - Listar programaciones
- POST /api/schedules - Crear programación
- GET /api/schedules/:id - Obtener programación
- PUT /api/schedules/:id - Actualizar programación
- DELETE /api/schedules/:id - Eliminar programación
- PUT /api/schedules/:id/progress - Actualizar progreso

### Reportes
- GET /api/reports - Listar reportes
- POST /api/reports/generate - Generar reporte
- GET /api/reports/:id - Obtener reporte
- DELETE /api/reports/:id - Eliminar reporte

### Requerimientos
- GET /api/requirements - Listar requerimientos
- POST /api/requirements - Crear requerimiento (solo admin)
- GET /api/requirements/:id - Obtener requerimiento
- PUT /api/requirements/:id - Actualizar requerimiento (solo admin)
- DELETE /api/requirements/:id - Eliminar requerimiento (solo admin)

### Ajustes y configuración
- GET /api/settings/:key - Obtener configuración por clave
- PUT /api/settings/:key - Actualizar configuración (solo admin)

### Logs de auditoría
- GET /api/audit-logs - Listar logs de auditoría (solo admin)
- POST /api/audit-logs - Crear log de auditoría

### Subida de archivos
- POST /api/upload - Subir archivo

## Documentación
La documentación completa de la API está disponible en /api-docs cuando el servidor está en ejecución.