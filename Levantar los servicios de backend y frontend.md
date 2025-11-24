# LEVANTAR LOS SERVICIOS DE BACKEND Y FRONTEND

Tener instalado y corriendo Docker.

<br>

Ver la versión Docker
```
docker version
```
Iniciar Docker
```
start docker
```
## ⚙️ BACKEND

### EJECUTAR EN CONSOLA:

```bash
docker-compose up -d mysql
timeout /t 10 /nobreak
npm run dev
```

EJECUTAR PRUEBAS:

node test-endpoints.js

## 🖥FRONTEND

```
npm run dev
```