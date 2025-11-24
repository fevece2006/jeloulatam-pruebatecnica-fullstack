# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3001

# Ejecutar el servidor
CMD ["npm", "run", "dev"]
