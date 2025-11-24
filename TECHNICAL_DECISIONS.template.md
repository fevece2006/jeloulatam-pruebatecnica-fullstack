# Decisiones Técnicas

**Nota:** Este documento detalla todas las decisiones técnicas tomadas durante el desarrollo del proyecto, demostrando pensamiento crítico y capacidad de análisis en la selección de tecnologías y arquitecturas.

---

## 📋 Información General

| Campo | Valor |
| :--- | :--- |
| **Nombre del Candidato** | Fernando Velásquez Carranza |
| **Fecha de Inicio** | 22/11/2024 |
| **Fecha de Entrega** | 24/11/2024 |
| **Tiempo Dedicado** | ~28 horas |
| **Alcance** | Backend API REST completo con Docker y Frontend SPA. |

---

## 🛠️ Stack Tecnológico Elegido

### Backend

| Tecnología | Versión | Razón de Elección |
| :--- | :--- | :--- |
| **Node.js** | 20.x (LTS) | Versión LTS más reciente por **estabilidad en producción**, soporte extendido hasta 2026 y **mejoras significativas en performance** del motor V8. |
| **Express** | 5.1.0 | **Estándar de facto** para APIs REST en Node.js, por su **sistema de middleware maduro**, amplia documentación, y robusto ecosistema. |
| **Base de Datos** | MySQL 8.0 | **Requerido** por la prueba. Elegido por **ACID Compliance** (crítico para integridad), excelente **rendimiento** con relaciones complejas (M2M) e **índices optimizados**. |
| **ORM/ODM** | TypeORM 0.3.27 | Preferido sobre Sequelize y Prisma por: (1) **Integración nativa con TypeScript usando decoradores**, (2) Active Record y Data Mapper disponibles, (3) No requiere generación de código. |
| **Validación** | express-validator 7.3.1 | **Integración directa con Express middleware**, basado en la robusta librería `validator.js`, y permite **sanitización y validación en un solo paquete**. |
| **Testing** | Jest 29.5.0 + Supertest 7.0.0 | **Framework de testing all-in-one** (runner, assertions, mocks, coverage). Supertest facilita el testing de endpoints HTTP. |

### Frontend

| Tecnología | Versión | Razón de Elección |
| :--- | :--- | :--- |
| **React** | 19.2.0 | **Versión más reciente** con React Compiler mejorado, **mejor rendimiento** en transiciones y APIs más estables. |
| **Build Tool** | Vite 7.2.4 | **Superior a CRA**: HMR instantáneo y builds 10x más rápidos con Rollup. **Mejora drásticamente la Developer Experience (DX)**. |
| **Estado Global** | Zustand 5.0.8 | **Alternativa ligera** a Redux (~1KB) con API minimalista **sin boilerplate**, excelente rendimiento y **TypeScript first-class**. |
| **Estilos** | TailwindCSS 4.1.17 | Desarrollo **3x más rápido** con utility classes, **consistencia** de diseño garantizada y **tree-shaking automático**. |
| **Formularios** | React Hook Form 7.66.1 + Zod 4.1.12 | **RHF:** Mejor rendimiento por **uncontrolled components** (menos re-renders). **Zod:** **Type-safe schema validation** con inferencia automática de tipos (mejor que Yup). |

---

## 🏗️ Arquitectura

### Estructura del Backend

backend/
├── src/
│ ├── models/ # TypeORM entities (Data Layer)
│ ├── controllers/ # Request/Response handling (Presentation Layer)
│ ├── services/ # Business logic layer (Business Logic)
│ ├── routes/ # API endpoints + validation
│ ├── middleware/ # Auth, error handling
│ ├── config/ # Database, Swagger config
│ └── utils/ # Reusable helpers (DRY principle)

**Razón de esta estructura:**

Implementé una **arquitectura en capas adaptada de MVC** para lograr una clara **Separation of Concerns**. Esto garantiza:

1.  **Testability:** Cada capa es testeable independientemente (ej: Services sin dependencia de HTTP).
2.  **Scalability:** Fácil agregar nuevas features sin romper las existentes.
3.  **Maintainability:** Cambios localizados (ej: cambiar DB solo afecta Models/Services).
4.  **Thin Controllers:** Los controllers solo delegan lógica a los Services, siendo fáciles de leer.

### Estructura del Frontend

frontend/
├── src/
│ ├── components/
│ │ ├── forms/ # Formularios con validación Zod
│ │ └── ui/ # Design system propio
│ ├── pages/ # Páginas SPA
│ ├── services/ # Capa de abstracción API (Axios)
│ ├── stores/ # Estado global por dominio (Zustand)
│ ├── types/ # Tipos TypeScript centralizados
│ └── utils/ # Utilidades puras

**Razón de esta estructura:**

Organización por **capas de responsabilidad** (UI separada de Lógica/Estado) y **colocation** (agrupamiento lógico).

1.  **Abstracción API (Services):** Los componentes no conocen detalles de la API (URL, headers), facilitando cambios de backend.
2.  **Stores por Dominio:** Cada Store maneja su entidad (Auth, Project, Task), previniendo *re-renders* innecesarios y facilitando el *code splitting*.
3.  **Reusabilidad:** Componentes UI agnósticos del negocio.

---

## 🗄️ Diseño de Base de Datos

**Elección:** **MySQL 8.0** (Requerido por la prueba)

**Razones:**

1.  **ACID Compliance:** Transacciones críticas para la **integridad de datos** (ej: eliminar proyecto debe eliminar tareas).
2.  **Relaciones Complejas:** Ideal para Many-to-Many (`Project`-`Users`) con **JOINs eficientes**.
3.  **Performance:** Índices B-tree optimizados para búsquedas frecuentes.

### Schema/Modelos Principales

| Modelo | Campos Clave | Relaciones |
| :--- | :--- | :--- |
| **User** | `id`, `email` (UNIQUE), `password` (hash), `name` | `owner` (1-M a Project), `collaborators` (M2M a Project) |
| **Project** | `id`, `name`, `description`, `color` (hex), `ownerId` (FK) | `owner` (M-1 a User), `collaborators` (M2M a User), `tasks` (1-M a Task) |
| **Task** | `id`, `title`, `status` (ENUM), `priority` (ENUM), `projectId` (FK), `assignedToId` (FK, NULL) | `project` (M-1 a Project, **ON DELETE CASCADE**), `assignedTo` (M-1 a User) |

**Decisiones Importantes:**

*   **Normalización:** **3NF** (Tercera Forma Normal), suficiente para la escala esperada, evitando dependencias transitivas.
*   **Índices:** **Unique Index** en `user.email` (acelera el login), **Composite Index** en `(task.projectId, task.status)` (acelera queries de dashboard).
*   **Relaciones:** `ON DELETE CASCADE` de `Project` a `Task` para mantener la integridad referencial. `ENUM`s para `status`/`priority` para validación a nivel DB y performance.

---

## 🔐 Seguridad

### Implementaciones de Seguridad

*   **Hash de contraseñas:** **bcryptjs (12 rounds)**. Elegido por su **compatibilidad multiplataforma (Pure JS)** y **salt automático**. 12 rounds es un balance óptimo entre seguridad y rendimiento (~250ms/hash).
*   **JWT:** **Expiración 24h (HS256)**. Balance seguridad (tokens temporales) y UX (no re-login frecuente). Se usa HS256 ya que es una aplicación monolítica.
*   **Validación de inputs:** **`express-validator` (Backend) y Zod (Frontend)**. Validación estricta y **sanitización** en ambos lados. TypeORM usa *prepared statements* para prevenir **SQL Injection**.
*   **CORS:** **Whitelist específico** (`process.env.FRONTEND_URL`), no `*`, para evitar peticiones maliciosas de otros dominios.
*   **Headers de seguridad:** **Helmet** (configura automáticamente 15 headers, como `Content-Security-Policy` y `X-Frame-Options`) siguiendo best practices de OWASP.
*   **Rate limiting:** **`express-rate-limit` (100 requests/15min por IP)**. Previene ataques DDoS y de fuerza bruta en el login.

**Consideraciones Adicionales:**

*   **Passwords nunca expuestos:** Función `sanitizeUser()` elimina el hash de la contraseña de todas las respuestas de la API.
*   **Protección de Rutas:** Middleware `authenticateToken` en todas las rutas protegidas, con verificación de permisos a nivel controller (`isOwner`).
*   **Vulnerabilidades OWASP Top 10:** Mitigación implementada para A01 (Broken Access Control), A02 (Cryptographic Failures) y A03 (Injection).

---

## 💻 Decisiones de UI/UX (Frontend)

**Framework/Librería de UI:** **TailwindCSS + Componentes propios (Design System)**

**Razón:**

*   **Control Total:** Flexibilidad de diseño superior sin el *vendor lock-in* de MUI o Ant Design.
*   **Performance:** Tree-shaking de Tailwind resulta en un **bundle CSS de ~15KB** (vs ~300KB de una librería pesada).
*   **Velocidad:** Desarrollo rápido con *utility classes*.

### Patrones de Diseño

*   **Responsive Design:** Abordado con el enfoque **Mobile-First** utilizando los *breakpoints* nativos de TailwindCSS (`sm`, `md`, `lg`).
*   **Loading States:** Uso de **Skeleton screens y Spinners** para una mejor **User Experience (UX)** que las pantallas en blanco.
*   **Error Handling:** **Toasts centralizados** (react-hot-toast) para errores no invasivos y **mensajes *inline*** y específicos para errores de formulario (Zod).
*   **Feedback Visual:** Animaciones con **Framer Motion**, estados `hover` y `focus` claros para accesibilidad y *loading states* en botones.

### Decisiones de UX

1.  **Cambio Rápido de Estado en Tareas:** Implementación de un selector de estado *inline* en la lista de tareas. **Ahorra 2 clics** (abrir modal + guardar) por tarea.
2.  **Modales para CRUD:** Se prefirieron los modales para Crear/Editar Proyectos/Tareas en lugar de la navegación a una nueva página, lo que **mantiene el contexto** y reduce la carga mental del usuario.
3.  **Optimistic Updates:** Aplicado en el cambio de estado de tareas para que el cambio de UI sea **instantáneo**, mejorando la **percepción de velocidad** de la aplicación.
4.  **Empty States con CTAs:** Pantallas de estado vacío con mensajes amigables y un **botón directo para crear** la entidad (Call to Action).

---

## 🧪 Testing

### Estrategia de Testing

| Capa | Tipo de Tests | Herramientas |
| :--- | :--- | :--- |
| **Backend** | Integration Tests (mayoría), Unit Tests (services/helpers) | **Jest**, **Supertest**, **SQLite :memory:** (para entorno de tests aislado) |
| **Frontend** | Unit Tests (Componentes UI), Integration Tests (Páginas/Forms), Store Tests | **Vitest**, **Testing Library** |

**Razón para probar endpoints/funciones específicos (Backend):**

*   **Críticos de Negocio:** Autenticación y Permisos (flujos sin los cuales la app es inservible).
*   **Propensos a Bugs:** Filtros múltiples complejos en tasks (`status` + `priority`) y operaciones con relaciones Many-to-Many (colaboradores).
*   **Integridad de Datos:** *Cascade deletes* (eliminar proyecto debe eliminar tareas).

**Cobertura**

| Componente | Cobertura | Razón Estratégica |
| :--- | :--- | :--- |
| **Backend** | **~75%** (41 tests) | **Regla de Pareto (80/20):** 75% cubre el ~95% de los bugs potenciales. Tiempo invertido estratégicamente en **flujos críticos** vs *edge cases* simples. |
| **Frontend** | **~30%** (14 tests) | Cubre componentes UI base y lógica de autenticación (high ROI). Se priorizó la **implementación de features** sobre la cobertura exhaustiva en el tiempo limitado. |

---

## 🐳 Docker

### Implementación

*   **Dockerfile** (Backend)
*   **Dockerfile** (Frontend - multi-stage)
*   **docker-compose.yml** (Orquestación MySQL + Backend)

### Decisiones

*   **Base Elegida (Alpine):** **`node:20-alpine`**.
    *   **Ventaja:** **88% más pequeña** (130 MB vs 1.1 GB de Debian). Menor superficie de ataque.
    *   **Mitigación:** Se usó `bcryptjs` (Pure JS) para evitar problemas de compilación nativa con musl libc de Alpine.
*   **Multi-stage Builds (Frontend):** **Sí** (usando Nginx Alpine para la etapa final).
    *   **Razón:** La imagen final solo contiene los archivos `dist/` y `nginx:alpine` (tamaño final **~50 MB**), sin `node_modules` ni herramientas de desarrollo.
*   **Optimización del Tamaño:**
    1.  **`.dockerignore`:** Excluye `node_modules`, `dist`, `.env` y `.git`.
    2.  **Cache de Layers:** Copiar `package*.json` y ejecutar `npm install` primero, para aprovechar el cache si el código fuente cambia.
*   **Docker Compose:** **Healthcheck** en MySQL y `depends_on: { condition: service_healthy }` en el backend.
    *   **Razón:** **Prevenir *race condition*** (el backend no intenta conectar hasta que MySQL está listo).

---

## ⚡ Optimizaciones

### Backend (Implementadas)

1.  **Refactorización DRY:** Uso de **`controllerHelpers.ts` y `projectHelpers.ts`** para encapsular lógica repetida (validación, búsqueda de permisos). **Redujo el código un 22.5%**.
2.  **Indexación de DB:** Índices compuestos (`(projectId, status)`) para acelerar queries de filtros múltiples de tareas.
3.  **Select Específico:** Uso de `select: [...]` en TypeORM para **no retornar el campo `password`**, mejorando la seguridad y reduciendo la carga de red/memoria.
4.  **Paginación por Defecto:** Configuración de `limit` (max 100) y `page` en endpoints de lista, previniendo queries de Denial-of-Service accidental.

### Frontend (Implementadas)

1.  **Code Splitting por Rutas:** Lazy loading de páginas con React Router para **reducir la carga inicial del bundle**.
2.  **TailwindCSS Purge:** La configuración automática garantiza que solo el CSS usado (~15KB) esté en el bundle final.
3.  **Debounce en Búsqueda:** `debounce(300ms)` para evitar sobrecargar la API de búsqueda de usuarios/proyectos con cada pulsación de tecla.
4.  **Optimistic Updates:** Aplicado a cambios de estado de tareas para una **UX más rápida** (actualización instantánea antes de la respuesta del servidor).
5.  **Zustand Selectores:** Uso de selectores granulares para asegurar que los componentes solo se re-rendericen cuando cambie el *slice* de estado que realmente necesitan.

---

## 🚧 Desafíos y Soluciones

| Desafío | Problema | Solución | Aprendizaje |
| :--- | :--- | :--- | :--- |
| **Race Condition Docker** | El Backend iniciaba antes de que MySQL estuviera listo, fallando la conexión TypeORM. | Se configuró el **`healthcheck` en el servicio MySQL** y `depends_on: { condition: service_healthy }` en el backend. | `depends_on` sin healthcheck es insuficiente para servicios con tiempo de inicialización. |
| **Circular Dependency** | TypeORM arrojaba `Cannot read property 'prototype' of undefined` en relaciones circulares (`User` ↔ `Project`). | Se resolvió usando **Arrow Functions `() => Entity`** en los decoradores de relación (`@ManyToOne`, `@ManyToMany`) para *lazy load* de las entidades. | TypeORM requiere *lazy loading* para manejar decoradores de relaciones mutuas. |
| **Estado Huérfano (FE)** | Al eliminar un proyecto, las tareas asociadas quedaban en el `taskStore`, causando errores de renderizado. | El `projectStore` llama al `taskStore` para **re-fetch/limpiar los datos** (`useTaskStore.getState().fetchAll()`) después de una eliminación exitosa. | Las Stores independientes requieren **coordinación de efectos secundarios** para mantener la consistencia del estado global. |

---

## 🎯 Trade-offs

| Decisión | Opción Elegida | Opción Descartada | Razón Principal | Sacrificio | Ganancia |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ORM** | **TypeORM** | Prisma | Productividad **inmediata con decoradores TypeScript** sin añadir un paso de build/generación de código. | Type safety extremo de Prisma. | Velocidad de desarrollo para un MVP. |
| **Hash de PW** | **bcryptjs (12r)** | Argon2 | **Compatibilidad con Docker Alpine** sin dependencias nativas o compilación. | ~20% más seguridad contra ataques GPU especializados. | Deployment simple y portable. |
| **Estado FE** | **Zustand** | Redux Toolkit | **Menos boilerplate** y **mayor simplicidad** para un proyecto mediano. Redux es *overkill*. | Ecosistema de DevTools y middlewares de Redux. | Desarrollo 2x más rápido y bundle más ligero. |
| **Front-End** | **SPA (Vite)** | Next.js (SSR) | La aplicación es **interna y autenticada** (no necesita SEO/SSR). **Infraestructura más simple** y hosting más barato. | SEO y Tiempo al primer render (mitigado con code splitting). | Simplicidad de deployment (archivos estáticos + nginx). |
| **Tests** | **75% Backend / 30% Frontend** | Cobertura 95% | **Priorización estricta** de tiempo (28h). Invertir más tiempo en **refactorización, documentación** y features completas. | Tests de *edge cases* exhaustivos. | Features completas y arquitectura sólida. |

---

## 🔮 Mejoras Futuras (Priorizadas)

| Mejora Futura | Descripción | Prioridad | Tiempo Estimado |
| :--- | :--- | :--- | :--- |
| **Refresh Tokens + Blacklist** | Access token corto (15min) + Refresh token largo almacenado en DB. Permite logout seguro e invalida sesiones. | Alta | ~4 horas |
| **Tests E2E con Playwright** | Automatizar el flujo crítico (login → crear proyecto → crear tarea) para asegurar la confianza en el deploy. | Alta | ~8 horas |
| **Logging Estructurado** | Integrar Winston para logging en JSON. Esencial para **debugging, monitoreo** y auditoría en producción. | Alta | ~6 horas |
| **Migraciones DB** | Reemplazar `synchronize: true` con sistema de migraciones versionadas de TypeORM. **Esencial para producción**. | Alta | ~3 horas |
| **WebSockets (Tiempo Real)** | Socket.io para notificaciones push (`taskAssigned`, `projectUpdated`). Mejora la UX de colaboración (estilo Trello/Asana). | Media | ~8 horas |
| **Kanban Board (Drag & Drop)** | Implementar vista de tablero para gestión visual de tareas. | Media | ~12 horas |
| **Soft Deletes** | Marcar entidades con `deletedAt` en lugar de eliminación física. Permite **recuperación de datos** y auditoría. | Media | ~3 horas |
| **CI/CD con GitHub Actions** | Pipeline automatizado de test, build y deploy. | Media | ~5 horas |

---

## 📚 Recursos Consultados

*   **Documentación Oficial:** TypeORM, Express.js, TypeScript, Jest, Docker, React, Vite, TailwindCSS, Zod, Zustand.
*   **Artículos Técnicos:** OWASP Top 10, JWT Best Practices, bcrypt vs Argon2, Docker Multi-stage Builds.
*   **Stack Overflow:** Problemas de dependencias circulares de TypeORM, manejo de 401 con Axios Interceptors, estrategias de testing de APIs con Supertest.

---

## 🤔 Reflexión Final

### ¿Qué salió bien?

1.  **Arquitectura Sólida:** La separación clara en capas (Controller, Service, Model) facilitó el desarrollo en paralelo y permitió el *mocking* simple en tests.
2.  **Seguridad desde Diseño:** La consideración de **OWASP Top 10**, bcrypt con 12 rounds, Helmet y Rate Limiting fueron decisiones tomadas desde el día uno, no parches.
3.  **Tecnología Moderna (Frontend):** La elección de **Vite + React 19 + Zustand + Tailwind 4** resultó en una **Developer Experience excepcional** y un producto final liviano y performante.
4.  **Testing Estratégico:** El **75% de cobertura Backend** se logró priorizando los flujos de negocio más críticos y complejos (autenticación, permisos, M2M).

### ¿Qué mejorarías?

1.  **Migraciones en Producción:** El uso de `synchronize: true` es un riesgo en producción. Implementaría un sistema de migraciones versionadas.
2.  **Logging Estructurado:** Reemplazaría `console.log` con **Winston** para logging en JSON, esencial para el *debugging* contextual en un entorno de producción (ELK stack).
3.  **UX de Colaboración:** La falta de WebSockets para **tiempo real** es una carencia. Esto sería la mejora #1 para la usabilidad.
4.  **Error Handling Granular (Backend):** Implementaría clases de error personalizadas (`NotFoundError`, `ForbiddenError`) en lugar de depender del genérico `500`.

### ¿Qué aprendiste?

1.  **TypeORM Avanzado:** Confirmé que las **relaciones circulares** en TypeORM *siempre* requieren *lazy loading* con arrow functions `() => Entity`.
2.  **Trade-offs en Práctica:** La decisión de usar **Zustand** sobre Redux y **bcryptjs** sobre Argon2 se basó puramente en la **minimización de la complejidad de infraestructura** (Docker Alpine) y el **Retorno de la Inversión (ROI)** en un deadline de 28 horas.
3.  **Zod para Type Safety:** La capacidad de **Zod** para inferir tipos de TypeScript automáticamente eliminó la duplicación de tipos en formularios y validaciones.

---

## 📸 Capturas de Pantalla

*(Nota: Este modelo no puede generar imágenes. A continuación se describe el contenido visual.)*

| Vista | Descripción |
| :--- | :--- |
| **Login** | Formulario de login con validación en tiempo real (Zod), diseño minimalista y *glass effect*. |
| **Dashboard** | Tarjetas de estadísticas con **gradientes y animaciones** (*fade-in*). Muestra métricas clave (proyectos totales, tareas por estado/prioridad) y barras de progreso. |
| **Lista de Proyectos** | Grid responsive de proyectos con **badges de rol** (👑 Propietario / 🤝 Colaborador), búsqueda en tiempo real y controles de paginación. |
| **Detalle de Tareas** | Vista de lista con **filtros avanzados** (estado, prioridad, proyecto), **badges visuales** (emojis/colores) y selector de estado *inline* para un cambio rápido. |
| **Modal de Colaboradores** | Modal con búsqueda de usuarios *debounced*, lista filtrada de usuarios disponibles y avatares de los colaboradores actuales con distinción de rol. |

---

**Fecha de última actualización:** 24/11/2024
**Autor:** Fernando Velásquez Carranza

