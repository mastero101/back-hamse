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
│   ├── config/
│   │   ├── auth.config.js
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── activity.controller.js
│   │   ├── schedule.controller.js
│   │   └── report.controller.js
│   ├── middleware/
│   │   └── auth.jwt.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── activity.model.js
│   │   ├── schedule.model.js
│   │   └── report.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── activity.routes.js
│   │   ├── schedule.routes.js
│   │   └── report.routes.js
│   └── app.js
├── package.json
└── README.md
 ```

## API Endpoints
### Autenticación
- POST /api/auth/signin - Iniciar sesión
- POST /api/auth/signup - Registrar usuario (solo admin)
- POST /api/auth/refresh-token - Renovar token
- POST /api/auth/change-password - Cambiar contraseña
### Actividades
- GET /api/activities - Listar actividades
- POST /api/activities - Crear actividad
- GET /api/activities/:id - Obtener actividad
- PUT /api/activities/:id - Actualizar actividad
- DELETE /api/activities/:id - Eliminar actividad
### Programación
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
## Documentación
La documentación completa de la API está disponible en /api-docs cuando el servidor está en ejecución.

## Licencia
Este proyecto está bajo la Licencia MIT.