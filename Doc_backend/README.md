# Backend - Plataforma de Gestión de Proyectos

API RESTful desarrollada con Node.js, Express, TypeScript y MySQL para la gestión colaborativa de proyectos y tareas.

## 🚀 Características

- ✅ Autenticación JWT segura
- ✅ CRUD completo de proyectos y tareas
- ✅ Sistema de colaboradores
- ✅ Filtros y búsqueda avanzada
- ✅ Estadísticas de usuario
- ✅ Validación de datos
- ✅ Documentación Swagger
- ✅ Tests con Jest
- ✅ TypeScript
- ✅ Rate limiting
- ✅ Seguridad con Helmet y CORS

## 📋 Prerrequisitos

- Node.js v18 o superior
- MySQL 8.0 o superior
- npm o yarn

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:

Crear archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=app_user
DB_PASSWORD=userpassword
DB_NAME=project_management

# JWT Secret (cambiar en producción)
JWT_SECRET=tu_clave_super_secreta_aqui_cambiar_en_produccion

# CORS
FRONTEND_URL=http://localhost:3000
```

3. Configurar MySQL:

```sql
-- Crear base de datos
CREATE DATABASE project_management;

-- Crear usuario
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'userpassword';
GRANT ALL PRIVILEGES ON project_management.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Tests
```bash
# Instalar dependencias de testing
npm install

# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage

# Modo watch
npm run test:watch
```

## 🐳 Docker

```bash
# Iniciar con Docker Compose
docker-compose up -d

# Detener
docker-compose down
```

## 📚 Documentación API

### Swagger UI
Una vez iniciado el servidor, acceder a:
```
http://localhost:3001/api/docs
```

### Documentación Detallada
Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔑 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Proyectos
- `GET /api/projects` - Listar proyectos (paginado)
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto
- `POST /api/projects/:id/collaborators` - Añadir colaborador

### Tareas
- `GET /api/tasks` - Listar tareas (con filtros)
- `GET /api/tasks/:id` - Obtener tarea
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Estadísticas
- `GET /api/stats` - Obtener estadísticas del usuario

## 🧪 Testing

El proyecto incluye tests comprehensivos para:
- Autenticación (registro, login, perfil)
- Proyectos (CRUD, colaboradores)
- Tareas (CRUD, filtros)
- Estadísticas

Ejecutar con:
```bash
npm test
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (12 rounds)
- JWT para autenticación
- Rate limiting (100 req/15min)
- Helmet para headers de seguridad
- CORS configurado
- Validación de entrada con express-validator

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuraciones (DB, Swagger)
│   ├── controllers/    # Controladores de rutas
│   ├── middleware/     # Middleware (auth)
│   ├── models/         # Modelos TypeORM
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   ├── tests/          # Tests unitarios e integración
│   ├── app.ts          # Configuración Express
│   └── server.ts       # Punto de entrada
├── .env                # Variables de entorno
├── tsconfig.json       # Configuración TypeScript
├── jest.config.js      # Configuración Jest
└── package.json        # Dependencias
```

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **Lenguaje**: TypeScript
- **ORM**: TypeORM
- **Base de Datos**: MySQL 8
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: express-validator
- **Testing**: Jest + Supertest
- **Documentación**: Swagger/OpenAPI
- **Seguridad**: Helmet, bcrypt, CORS, rate-limit

## 📄 Licencia

MIT

## 👤 Autor

Desarrollado como prueba técnica para Fullstack Developer
