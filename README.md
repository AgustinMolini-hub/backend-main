# ShipNow Backend

Backend REST API para **ShipNow**, desarrollado con Node.js, Express y MongoDB utilizando Mongoose.

La aplicación está organizada mediante una arquitectura por capas separando rutas, controladores, servicios, repositorios y modelos.

Cuenta con:

- Manejo centralizado de errores.
- Validaciones de negocio.
- Documentación Swagger/OpenAPI.
- Generación de datos mock.
- Sistema de logging.
- Carga de archivos mediante Multer.
- Persistencia mediante MongoDB Atlas.

---

# Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Swagger / OpenAPI
- dotenv
- cross-env
- Winston
- winston-daily-rotate-file
- Multer
- Mocha
- Chai
- Supertest
- ES Modules

---

# Requisitos

Antes de ejecutar el proyecto se necesita:

- Node.js
- npm
- Cuenta de MongoDB Atlas

Comprobar Node.js:

```bash
node --version
```

Comprobar npm:

```bash
npm --version
```

---

# Instalación

Clonar repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd backend-main
```

Instalar dependencias:

```bash
npm install
```

---

# Variables de entorno

El proyecto utiliza archivos de configuración mediante variables de entorno.

## Desarrollo

Crear:

```
.env
```

Ejemplo:

```env
PORT=8080

MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_db

NODE_ENV=development
```

---

## Testing

Crear:

```
.env.test
```

Ejemplo:

```env
PORT=8081

MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_test

NODE_ENV=test
```

Se recomienda utilizar una base de datos independiente para pruebas:

```
shipnow_test
```

---

# Seguridad y archivos ignorados

Los siguientes archivos y carpetas no deben formar parte del repositorio:

```
.env
.env.test
logs/
uploads/
node_modules/
```

Nunca publicar:

- Credenciales MongoDB.
- Connection strings reales.
- API Keys.
- Tokens.
- Información sensible.

Los archivos cargados por usuarios y comprobantes se almacenan dentro de `uploads/` y no se versionan mediante Git.

---

# MongoDB Atlas

La aplicación utiliza MongoDB Atlas como base de datos.

La conexión está centralizada en:

```
src/config/database.js
```

Función principal:

```javascript
connectDB()
```

Cuando la conexión es correcta:

```
Conexión a MongoDB establecida
```

Si la conexión falla, el error es registrado y la aplicación no inicia correctamente.

---

# Arquitectura del proyecto

La aplicación utiliza una arquitectura basada en capas:

```
Routes
   |
Controllers
   |
Services
   |
Repositories
   |
Models
   |
MongoDB
```

## Routes

Definen los endpoints disponibles.

## Controllers

Gestionan solicitudes HTTP y respuestas.

## Services

Contienen lógica de negocio y validaciones.

## Repositories

Abstraen el acceso a MongoDB.

## Models

Definen estructuras mediante Mongoose.

---

# Estructura actual

```
src/

├── config/
│   ├── database.js
│   ├── env.config.js
│   ├── logger.js
│   └── multer.config.js

├── constants/
│   └── index.js

├── controllers/
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   └── mock.controller.js

├── docs/
│   └── swagger.js

├── errors/
│   ├── app.error.js
│   └── error.dictionary.js

├── middlewares/
│   ├── error.middleware.js
│   └── upload-type.middleware.js

├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── order.model.js
│   └── delivery.model.js

├── repositories/
│   ├── user.repository.js
│   ├── product.repository.js
│   ├── order.repository.js
│   └── mock.repository.js

├── routes/
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   └── mock.routes.js

├── services/
│   ├── user.service.js
│   ├── product.service.js
│   ├── order.service.js
│   └── mock.service.js

├── app.js
└── server.js
```

---

# API

Base URL:

```
http://localhost:8080
```

---

# Health Check

Endpoint:

```
GET /health
```

Respuesta:

```json
{
 "status":"ok",
 "timestamp":"2026-08-29T00:00:00.000Z"
}
```

---

# Users API

Base:

```
/api/users
```

## Obtener usuarios

```
GET /api/users
```

---

## Crear usuario

```
POST /api/users
```

Ejemplo:

```json
{
 "name":"Usuario Prueba",
 "email":"usuario@test.com",
 "role":"USER"
}
```

Roles disponibles:

```
ADMIN
USER
DRIVER
```

---

## Subir documento de usuario

Endpoint:

```
POST /api/users/:id/documents
```

Ejemplo:

```bash
curl.exe -X POST "http://localhost:8080/api/users/ID/documents" ^
-F "file=@documento.png" ^
-F "documentType=DNI"
```

Tipos permitidos:

```
DNI
LICENCIA
CEDULA
```

Archivos aceptados:

```
PDF
JPG
JPEG
PNG
```

Tamaño máximo:

```
5 MB
```

Ubicación:

```
uploads/users
```

---

# Orders API

Base:

```
/api/orders
```

---

## Obtener pedidos

```
GET /api/orders
```

---

## Crear pedido

```
POST /api/orders
```

Ejemplo:

```json
{
 "user":"ID_USUARIO",
 "total":2500,
 "priority":"HIGH"
}
```

Prioridades:

```
LOW
MEDIUM
HIGH
```

Estado inicial:

```
PENDING
```

---

## Actualizar estado

```
PATCH /api/orders/:id/status
```

Ejemplo:

```json
{
 "status":"CONFIRMED"
}
```

Estados disponibles:

```
PENDING
CONFIRMED
IN_TRANSIT
DELIVERED
CANCELLED
```

---

## Subir comprobante

Endpoint:

```
POST /api/orders/:id/receipt
```

Ejemplo:

```bash
curl.exe -X POST "http://localhost:8080/api/orders/ID/receipt" ^
-F "file=@comprobante.png"
```

Archivos aceptados:

```
PDF
JPG
JPEG
PNG
```

Tamaño máximo:

```
5 MB
```

Ubicación:

```
uploads/receipts
```

---

# Products API

Base:

```
/api/products
```

Obtener productos:

```
GET /api/products
```

Crear producto:

```
POST /api/products
```

Estados:

```
AVAILABLE
OUT_OF_STOCK
DISCONTINUED
```

---

# Mocks API

Base:

```
/api/mocks
```

Permite generar datos de prueba:

- Usuarios.
- Drivers.
- Pedidos.
- Entregas.

La lógica se encuentra en:

```
src/services/mock.service.js
```

---

# Manejo de errores

Los errores utilizan:

```
src/errors/app.error.js
```

Diccionario:

```
src/errors/error.dictionary.js
```

Middleware:

```
src/middlewares/error.middleware.js
```

Formato:

```json
{
 "status":"error",
 "error":{
   "code":"ERROR_CODE",
   "message":"Mensaje",
   "details":null
 }
}
```

---

# Errores disponibles

## Usuarios

```
USER_NOT_FOUND
INVALID_USER_DATA
USER_ALREADY_EXISTS
INVALID_DOCUMENT_TYPE
```

## Pedidos

```
ORDER_NOT_FOUND
INVALID_ORDER_DATA
INVALID_ORDER_STATUS
```

## Productos

```
PRODUCT_NOT_FOUND
INVALID_PRODUCT_DATA
INVALID_PRODUCT_PRICE
```

## Archivos

```
FILE_REQUIRED
INVALID_FILE_TYPE
INVALID_FILE_FIELD
FILE_TOO_LARGE
INVALID_UPLOAD_TYPE
FILE_SAVE_ERROR
```

## Mocks

```
INVALID_MOCK_QUANTITY
NEGATIVE_MOCK_QUANTITY
MAX_MOCK_QUANTITY
MOCK_SEED_ERROR
```

## Base de datos

```
DATABASE_ERROR
```

---

# Logging

El sistema utiliza Winston como logger principal.

Archivo:

```
src/config/logger.js
```

Niveles disponibles:

```
fatal
error
warning
info
http
debug
```

Los errores se almacenan con rotación diaria dentro de:

```
logs/
```

---

# Swagger

Documentación disponible:

```
http://localhost:8080/api/docs
```

Permite:

- Consultar endpoints.
- Visualizar modelos.
- Ejecutar pruebas desde Swagger UI.

---

# Tests

Frameworks utilizados:

- Mocha
- Chai
- Supertest

Ejecutar:

```bash
npm test
```

Los tests verifican:

- Health check.
- Usuarios.
- Pedidos.
- Validaciones.
- Manejo de errores.
- Persistencia en MongoDB.

---

# Comandos disponibles

Instalar dependencias:

```bash
npm install
```

Ejecutar desarrollo:

```bash
npm run dev
```

Ejecutar tests:

```bash
npm test
```

---

# Estado actual del proyecto

ShipNow Backend cuenta actualmente con:

✅ Express configurado  
✅ MongoDB Atlas  
✅ Mongoose  
✅ Variables de entorno  
✅ Arquitectura por capas  
✅ Usuarios API  
✅ Productos API  
✅ Pedidos API  
✅ Sistema de mocks  
✅ Manejo centralizado de errores  
✅ Diccionario de errores  
✅ Logger Winston  
✅ Swagger/OpenAPI  
✅ Health Check  
✅ Upload de documentos  
✅ Upload de comprobantes  
✅ Validación de archivos  
✅ Límite de tamaño 5 MB  
✅ Tests automatizados  

---

# Flujo recomendado antes del commit

Ejecutar:

```bash
npm test
```

Verificar:

```bash
git status
```

Confirmar que no estén incluidos:

```
.env
.env.test
uploads/
logs/
node_modules/
```

Luego:

```bash
git add .

git commit -m "feat: implementa carga de documentos, comprobantes y mejoras en pedidos"

git push origin main
```

---

# Licencia

Proyecto desarrollado con fines educativos y/o de desarrollo de la plataforma ShipNow.