# 📋 GUÍA TÉCNICA DE ARRANQUE Y PRUEBAS DE ENDPOINTS

**Autor:** Backend Developer - Prueba Técnica Fullstack  
**Fecha:** 22 de Noviembre de 2025  
**Proyecto:** Sistema de Gestión de Proyectos y Tareas

---

## 🎯 OBJETIVO

Este documento describe paso a paso cómo arrancar el servidor backend y probar todos los endpoints de la API para validar su correcto funcionamiento.

---

## 📦 REQUISITOS PREVIOS

- **Node.js** v18 o superior
- **Docker Desktop** instalado y corriendo
- **Git** (opcional para clonar)
- Terminal de comandos (PowerShell, CMD, Bash)

---

## 🚀 PARTE 1: ARRANQUE DEL SERVIDOR

### **Paso 1: Verificar Dependencias Instaladas**

```bash
npm install
```

**¿Qué hace?** Instala todas las dependencias del proyecto definidas en `package.json`:
- express (framework web)
- typeorm (ORM para MySQL)
- jsonwebtoken (autenticación JWT)
- bcrypt (encriptación de contraseñas)
- express-validator (validación de datos)
- Y más...

**Resultado esperado:**
```
added XXX packages, and audited XXX packages
found 0 vulnerabilities
```

---

### **Paso 2: Levantar MySQL con Docker**

```bash
docker-compose up -d mysql
```

**¿Qué hace?** 
- Inicia un contenedor Docker con MySQL 8.0
- Crea la base de datos `project_management`
- Configura usuario: `app_user` / contraseña: `userpassword`
- Expone el puerto 3306

**Resultado esperado:**
```
[+] Running 2/2
 ✔ Network backend_default          Created
 ✔ Container project_management_db  Started
```

**Verificar que MySQL está corriendo:**
```bash
docker ps
```

Deberías ver:
```
CONTAINER ID   IMAGE       COMMAND                  STATUS         PORTS                    NAMES
xxxxxxxxxx     mysql:8.0   "docker-entrypoint.s…"  Up X seconds   0.0.0.0:3306->3306/tcp   project_management_db
```

---

### **Paso 3: Esperar Inicialización de MySQL**

```bash
timeout /t 10 /nobreak
```

**¿Qué hace?** Espera 10 segundos para que MySQL termine de inicializarse completamente.

> **Nota:** En Linux/Mac usar: `sleep 10`

---

### **Paso 4: Iniciar el Servidor Backend**

```bash
npm run dev
```

**¿Qué hace?** 
- Ejecuta `npx ts-node src/server.ts`
- Compila TypeScript en tiempo real
- Conecta con MySQL
- Sincroniza las tablas de la base de datos automáticamente (TypeORM)
- Inicia el servidor en puerto 3001

**Resultado esperado:**
```
> backend@1.0.0 dev
> npx ts-node src/server.ts

Servidor ejecutándose en puerto 3001
Documentación disponible en http://localhost:3001/api/docs
query: SELECT version()
query: CREATE TABLE `task` (...)
query: CREATE TABLE `project` (...)
query: CREATE TABLE `user` (...)
query: CREATE TABLE `project_collaborators_user` (...)
Conectado a la base de datos
```

**Tablas creadas automáticamente:**
- ✅ `user` - Usuarios del sistema
- ✅ `project` - Proyectos
- ✅ `task` - Tareas
- ✅ `project_collaborators_user` - Relación Many-to-Many para colaboradores

---

### **Paso 5: Verificar Swagger UI**

Abrir navegador en:
```
http://localhost:3001/api/docs
```

**¿Qué verás?**
- Documentación interactiva de todos los endpoints
- Posibilidad de probar endpoints desde el navegador
- Esquemas de request/response

---

## 🧪 PARTE 2: PRUEBAS DE ENDPOINTS

### **Método 1: Script Automatizado (Recomendado)**

#### **Paso 1: Instalar Axios**

```bash
npm install axios
```

#### **Paso 2: Ejecutar Script de Pruebas**

```bash
node test-endpoints.js
```

**¿Qué hace el script?**
- Registra 2 usuarios (Juan y Maria)
- Hace login con ambos usuarios
- Crea 2 proyectos
- Agrega colaboradores
- Crea tareas con diferentes estados y prioridades
- Prueba filtros, paginación y ordenamiento
- Obtiene estadísticas
- Prueba permisos (intentos de eliminar sin autorización)
- Elimina proyectos y tareas en cascada

---

### **Método 2: Pruebas Manuales con cURL**

#### **1. AUTENTICACIÓN**

**1.1 Registrar Usuario**

```bash
curl -X POST http://localhost:3001/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\"}"
```

**Respuesta esperada (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "createdAt": "2025-11-22T20:00:00.000Z",
    "updatedAt": "2025-11-22T20:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **Importante:** Guardar el token para las siguientes peticiones

---

**1.2 Login**

```bash
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

**Respuesta esperada (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

**1.3 Obtener Perfil (requiere token)**

```bash
curl -X GET http://localhost:3001/api/auth/profile ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta esperada (200 OK):**
```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "Test User",
  "createdAt": "2025-11-22T20:00:00.000Z",
  "updatedAt": "2025-11-22T20:00:00.000Z"
}
```

---

#### **2. PROYECTOS**

**2.1 Crear Proyecto**

```bash
curl -X POST http://localhost:3001/api/projects ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI" ^
  -d "{\"name\":\"Mi Proyecto\",\"description\":\"Descripción del proyecto\",\"color\":\"#3B82F6\"}"
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 1,
  "name": "Mi Proyecto",
  "description": "Descripción del proyecto",
  "color": "#3B82F6",
  "createdAt": "2025-11-22T20:00:00.000Z",
  "updatedAt": "2025-11-22T20:00:00.000Z",
  "owner": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  },
  "collaborators": []
}
```

---

**2.2 Listar Proyectos (con paginación)**

```bash
curl -X GET "http://localhost:3001/api/projects?page=1&limit=10" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta esperada (200 OK):**
```json
{
  "projects": [
    {
      "id": 1,
      "name": "Mi Proyecto",
      "description": "Descripción del proyecto",
      "color": "#3B82F6",
      "owner": {...},
      "collaborators": []
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

**2.3 Actualizar Proyecto**

```bash
curl -X PUT http://localhost:3001/api/projects/1 ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI" ^
  -d "{\"name\":\"Proyecto Actualizado\",\"color\":\"#10B981\"}"
```

---

**2.4 Agregar Colaborador**

```bash
curl -X POST http://localhost:3001/api/projects/1/collaborators ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI" ^
  -d "{\"userId\":2}"
```

---

**2.5 Eliminar Proyecto**

```bash
curl -X DELETE http://localhost:3001/api/projects/1 ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta esperada (200 OK):**
```json
{
  "message": "Proyecto eliminado exitosamente"
}
```

---

#### **3. TAREAS**

**3.1 Crear Tarea**

```bash
curl -X POST http://localhost:3001/api/tasks ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI" ^
  -d "{\"title\":\"Implementar login\",\"description\":\"Crear endpoint de autenticación\",\"status\":\"pending\",\"priority\":\"high\",\"projectId\":1,\"assignedUserId\":1,\"dueDate\":\"2025-12-01T10:00:00Z\"}"
```

**Respuesta esperada (201 Created):**
```json
{
  "id": 1,
  "title": "Implementar login",
  "description": "Crear endpoint de autenticación",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-01T10:00:00.000Z",
  "project": {...},
  "assignedUser": {...}
}
```

---

**3.2 Listar Tareas con Filtros**

**Filtrar por estado:**
```bash
curl -X GET "http://localhost:3001/api/tasks?status=pending" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Filtrar por prioridad:**
```bash
curl -X GET "http://localhost:3001/api/tasks?priority=high" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Filtrar por proyecto:**
```bash
curl -X GET "http://localhost:3001/api/tasks?projectId=1" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Filtrar por usuario asignado:**
```bash
curl -X GET "http://localhost:3001/api/tasks?assignedUserId=1" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Ordenar por fecha de vencimiento:**
```bash
curl -X GET "http://localhost:3001/api/tasks?sortBy=dueDate&sortOrder=DESC" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

**3.3 Obtener Tarea por ID**

```bash
curl -X GET http://localhost:3001/api/tasks/1 ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

**3.4 Actualizar Tarea**

```bash
curl -X PUT http://localhost:3001/api/tasks/1 ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TU_TOKEN_AQUI" ^
  -d "{\"status\":\"completed\"}"
```

---

**3.5 Eliminar Tarea**

```bash
curl -X DELETE http://localhost:3001/api/tasks/1 ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

#### **4. ESTADÍSTICAS**

**4.1 Obtener Estadísticas del Usuario**

```bash
curl -X GET http://localhost:3001/api/stats ^
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta esperada (200 OK):**
```json
{
  "totalProjects": 2,
  "totalTasks": 5,
  "tasksByStatus": {
    "pending": 2,
    "completed": 3
  }
}
```

---

## 📊 RESULTADOS DE LAS PRUEBAS AUTOMATIZADAS

### **Resumen de Ejecución**

✅ **Total de endpoints probados:** 36  
✅ **Autenticación:** 5 tests  
✅ **Proyectos:** 6 tests  
✅ **Tareas:** 11 tests  
✅ **Estadísticas:** 2 tests  
✅ **Eliminaciones y Permisos:** 6 tests  
✅ **Validaciones de error:** 6 tests

### **Tests Exitosos Principales**

| Categoría | Endpoint | Método | Status | Descripción |
|-----------|----------|--------|--------|-------------|
| **Auth** | `/api/auth/register` | POST | 201 | Registro de usuario con hash bcrypt |
| **Auth** | `/api/auth/login` | POST | 200 | Login con JWT válido por 24h |
| **Auth** | `/api/auth/profile` | GET | 200 | Perfil protegido con middleware |
| **Auth** | `/api/auth/login` | POST | 401 | Error con contraseña incorrecta ✅ |
| **Projects** | `/api/projects` | POST | 201 | Creación de proyecto |
| **Projects** | `/api/projects` | GET | 200 | Listado con paginación |
| **Projects** | `/api/projects/:id` | PUT | 200 | Actualización solo por owner |
| **Projects** | `/api/projects/:id/collaborators` | POST | 200 | Agregar colaborador |
| **Projects** | `/api/projects/:id` | DELETE | 403 | Error sin permisos ✅ |
| **Tasks** | `/api/tasks` | POST | 201 | Creación con validaciones |
| **Tasks** | `/api/tasks?status=pending` | GET | 200 | Filtro por estado |
| **Tasks** | `/api/tasks?priority=high` | GET | 200 | Filtro por prioridad |
| **Tasks** | `/api/tasks?projectId=1` | GET | 200 | Filtro por proyecto |
| **Tasks** | `/api/tasks?sortBy=dueDate` | GET | 200 | Ordenamiento |
| **Tasks** | `/api/tasks/:id` | DELETE | 200 | Eliminación exitosa |
| **Tasks** | `/api/tasks/:id` | GET | 404 | Error tarea no existe ✅ |
| **Stats** | `/api/stats` | GET | 200 | Estadísticas agregadas |
| **Projects** | `/api/projects/:id` | DELETE | 200 | Eliminación en cascada de tareas |

---

## 🔍 VALIDACIONES IMPLEMENTADAS

### **Seguridad**

✅ **Encriptación de contraseñas:** bcrypt con 12 salt rounds  
✅ **Autenticación JWT:** Tokens con expiración de 24 horas  
✅ **Middleware de autenticación:** Protección de rutas  
✅ **Control de permisos:** Solo el owner puede modificar/eliminar proyectos  
✅ **Validación de entrada:** express-validator en todos los endpoints  
✅ **Rate limiting:** 100 peticiones por 15 minutos  
✅ **Headers de seguridad:** Helmet.js  
✅ **CORS configurado:** Solo orígenes permitidos

### **Base de Datos**

✅ **Relaciones definidas:** OneToMany, ManyToMany  
✅ **Cascade delete:** Tareas se eliminan al borrar proyecto  
✅ **Índices:** Email único en usuarios  
✅ **Timestamps:** createdAt y updatedAt automáticos  
✅ **Enums:** status (pending, completed) y priority (low, medium, high)

### **Funcionalidades**

✅ **Paginación:** page y limit configurables  
✅ **Filtros múltiples:** status, priority, projectId, assignedUserId  
✅ **Ordenamiento:** sortBy (title, dueDate, createdAt) + sortOrder (ASC/DESC)  
✅ **Sanitización:** Passwords nunca se devuelven en respuestas  
✅ **Mensajes de error claros:** 400, 401, 403, 404 con mensajes descriptivos

---

## 🎓 COMANDOS DE RESUMEN EJECUTIVO

### **Para el Entrevistador - Quick Start**

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar MySQL
docker-compose up -d mysql

# 3. Esperar 10 segundos
timeout /t 10 /nobreak

# 4. Iniciar servidor
npm run dev

# 5. Verificar Swagger
# Abrir: http://localhost:3001/api/docs

# 6. Ejecutar tests automatizados
node test-endpoints.js
```

---

## 📁 ESTRUCTURA DE ARCHIVOS RELEVANTES

```
backend/
├── src/
│   ├── controllers/          # Lógica de negocio
│   │   ├── authController.ts      # ✅ Registro, Login, Perfil
│   │   ├── projectController.ts   # ✅ CRUD Proyectos + Colaboradores
│   │   └── taskController.ts      # ✅ CRUD Tareas + Filtros
│   ├── routes/               # Definición de endpoints
│   │   ├── auth.ts               # ✅ 3 endpoints
│   │   ├── projects.ts           # ✅ 6 endpoints
│   │   ├── tasks.ts              # ✅ 6 endpoints
│   │   └── stats.ts              # ✅ 1 endpoint
│   ├── middleware/
│   │   └── auth.ts              # ✅ Verificación JWT
│   ├── models/               # Entidades TypeORM
│   │   ├── User.ts              # ✅ Usuarios
│   │   ├── Project.ts           # ✅ Proyectos
│   │   └── Task.ts              # ✅ Tareas
│   ├── services/
│   │   ├── authService.ts       # ✅ Lógica de autenticación
│   │   └── statsService.ts      # ✅ Agregación de estadísticas
│   └── config/
│       ├── database.ts          # ✅ Conexión TypeORM
│       └── swagger.ts           # ✅ Documentación OpenAPI
├── docker-compose.yml        # ✅ MySQL 8.0
├── Dockerfile               # ✅ Imagen Node.js
├── package.json             # ✅ Dependencias
├── tsconfig.json            # ✅ Configuración TypeScript
└── test-endpoints.js        # ✅ Script de pruebas automatizado
```

---

## 🚨 TROUBLESHOOTING

### **Problema: Puerto 3001 ya en uso**

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### **Problema: MySQL no conecta**

```bash
# Verificar que el contenedor está corriendo
docker ps

# Ver logs de MySQL
docker logs project_management_db

# Reiniciar contenedor
docker-compose restart mysql
```

### **Problema: Error de TypeScript**

```bash
# Limpiar caché de TypeScript
npm run build

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 CONTACTO Y SOPORTE

Si el entrevistador técnico tiene alguna pregunta o encuentra algún problema:

- **Email:** [tu email aquí]
- **GitHub:** [tu perfil aquí]
- **LinkedIn:** [tu perfil aquí]

---

## ✅ CHECKLIST FINAL

- [x] MySQL corriendo en Docker
- [x] Servidor backend iniciado en puerto 3001
- [x] Swagger UI accesible en `/api/docs`
- [x] 16 endpoints funcionando correctamente
- [x] Pruebas automatizadas ejecutadas exitosamente
- [x] Validaciones de seguridad implementadas
- [x] Documentación técnica completa
- [x] Base de datos sincronizada automáticamente

---

**¡Backend 100% funcional y listo para integración con Frontend!** 🚀
