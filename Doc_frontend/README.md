# Frontend - TaskHub

Este directorio contiene la implementación del frontend de la aplicación TaskHub, una plataforma de gestión de proyectos y tareas colaborativa.

## Stack Tecnológico

- **Framework**: React 19
- **Lenguaje**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Estado Global**: Zustand
- **Estilos**: TailwindCSS
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios
- **UI/UX**: 
  - React Icons
  - React Hot Toast
  - Framer Motion
- **Testing**: Vitest + Testing Library

## Estructura del Proyecto

```
src/
├── components/
│   ├── forms/          # Formularios (Login, Register, Project, Task)
│   ├── layout/         # Componentes de layout (Navbar, Layout)
│   ├── ui/            # Componentes UI reutilizables (Button, Input, Modal, etc.)
│   └── ProtectedRoute.tsx
├── pages/             # Páginas de la aplicación
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   └── Tasks.tsx
├── services/          # Servicios API
│   ├── api.ts
│   ├── authService.ts
│   ├── projectService.ts
│   ├── taskService.ts
│   ├── statsService.ts
│   └── userService.ts
├── stores/            # Estado global con Zustand
│   ├── authStore.ts
│   ├── projectStore.ts
│   └── taskStore.ts
├── types/             # Tipos TypeScript
│   └── index.ts
├── test/              # Tests unitarios
│   └── setup.ts
├── App.tsx
└── main.tsx
```

## Funcionalidades Implementadas

### 1. Autenticación y Usuarios
- ✅ Registro de usuarios con validación
- ✅ Login con JWT
- ✅ Rutas protegidas
- ✅ Almacenamiento seguro del token
- ✅ Redirección automática según estado de autenticación

### 2. Gestión de Proyectos
- ✅ CRUD completo de proyectos
- ✅ Lista de proyectos con diseño responsive
- ✅ Búsqueda y filtrado
- ✅ Paginación
- ✅ Sistema de permisos (solo el creador puede editar/eliminar)
- ✅ Gestión de colaboradores

### 3. Gestión de Tareas
- ✅ CRUD completo de tareas
- ✅ Visualización en lista
- ✅ Estados: pendiente, en progreso, completada
- ✅ Prioridades: baja, media, alta
- ✅ Asignación de tareas
- ✅ Filtros interactivos (estado, prioridad, proyecto, búsqueda)
- ✅ Cambio rápido de estado

### 4. Dashboard y Estadísticas
- ✅ Visualización de estadísticas del usuario
- ✅ Total de proyectos y tareas
- ✅ Tareas por estado
- ✅ Resumen de actividad
- ✅ Gráficos visuales

## Instalación

### Prerrequisitos
- Node.js v18 o superior
- npm o yarn
- Docker y Docker Compose (opcional, para containerización)

### Método 1: Instalación Local

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus valores
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

4. Abrir http://localhost:5173

### Método 2: Docker (Desarrollo)

1. Construir y ejecutar con Docker Compose:
```bash
docker-compose up -d
```

2. Acceder a http://localhost:3000

### Método 3: Docker (Producción)

1. Construir imagen de producción:
```bash
docker build -t taskhub-frontend .
```

2. Ejecutar contenedor:
```bash
docker run -p 3000:80 taskhub-frontend
```

## Scripts Disponibles

### Desarrollo
```bash
npm run dev          # Inicia servidor de desarrollo (Vite)
npm run build        # Construye para producción
npm run preview      # Preview del build de producción
npm run lint         # Ejecuta ESLint
```

### Testing
```bash
npm run test         # Ejecuta tests con Vitest
npm run test:ui      # Abre interfaz de Vitest
```

### Docker
```bash
# Desarrollo
docker-compose up -d                    # Inicia todos los servicios
docker-compose down                     # Detiene todos los servicios
docker-compose logs -f frontend         # Ver logs del frontend

# Producción
docker build -t taskhub-frontend .                      # Construir imagen
docker run -p 3000:80 taskhub-frontend                  # Ejecutar contenedor
docker run -d -p 3000:80 taskhub-frontend               # Ejecutar en background
```

## Configuración de Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# API Backend URL
VITE_API_URL=http://localhost:3001/api
```

## Arquitectura Docker

### Dockerfile (Producción)
- **Stage 1 (Builder)**: Compila la aplicación React
  - Base: `node:20-alpine`
  - Instala dependencias
  - Ejecuta build de producción
  
- **Stage 2 (Runtime)**: Sirve archivos estáticos
  - Base: `nginx:alpine`
  - Copia build desde stage anterior
  - Configuración nginx optimizada
  - Health checks incluidos

### Docker Compose
Orquesta 3 servicios:
- **frontend**: React app (puerto 3000)
- **backend**: API REST (puerto 3001)
- **database**: PostgreSQL (puerto 5432)

Red interna para comunicación entre servicios.

## Optimizaciones de Producción

### Build
- Tree-shaking automático
- Code-splitting
- Minificación de assets
- Optimización de imágenes

### Nginx
- Gzip compression
- Cache de assets estáticos (1 año)
- Security headers
- Health check endpoint
- SPA routing configurado

### Docker
- Multi-stage build (imagen final ~50MB)
- Health checks
- Restart policies
- Volume persistence para DB

## Deployment

### Variables de Entorno Requeridas
```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-secret-key-min-32-chars

# Frontend (build time)
VITE_API_URL=https://api.tu-dominio.com/api
```

### Comandos de Deployment
```bash
# Build y push a registry
docker build -t registry.com/taskhub-frontend:latest .
docker push registry.com/taskhub-frontend:latest

# Deploy con Docker Compose
docker-compose -f docker-compose.yml up -d

# Verificar salud del contenedor
docker ps
docker logs taskhub-frontend
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` y configura la URL del backend:
```env
VITE_API_URL=http://localhost:3001/api
```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

## Testing

### Ejecutar tests
```bash
npm test
```

### Tests con UI
```bash
npm run test:ui
```

## Componentes UI Principales

### Button
Botón reutilizable con variantes (primary, secondary, danger, ghost) y estados de carga.

### Input / Textarea
Campos de formulario con labels y mensajes de error integrados.

### Select
Selector con opciones personalizables.

### Modal
Modal responsive con animaciones (Framer Motion).

### Card
Contenedor estilizado para contenido.

### Badge
Indicadores visuales para estados y prioridades.

### Spinner
Indicador de carga animado.

## Stores (Zustand)

### authStore
Gestión de autenticación y usuario actual.

### projectStore
CRUD de proyectos, paginación y gestión de colaboradores.

### taskStore
CRUD de tareas, filtros y actualización de estados.

## Validación de Formularios

Todos los formularios utilizan:
- **React Hook Form** para gestión del estado
- **Zod** para validación de esquemas
- **@hookform/resolvers** para integración

## Estilos

- **TailwindCSS** para estilos utility-first
- **Responsive design** con breakpoints móviles, tablet y desktop

## API Integration

Todos los servicios utilizan Axios con:
- Interceptores para autenticación automática
- Manejo centralizado de errores
- Redirección automática en caso de sesión expirada

## Rutas Disponibles

- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/dashboard` - Dashboard con estadísticas
- `/projects` - Gestión de proyectos
- `/tasks` - Gestión de tareas
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
