ShipNow Backend

Backend REST API para ShipNow, desarrollado con Node.js, Express y
MongoDB utilizando Mongoose.

Proyecto organizado mediante arquitectura por capas:

Routes

Controllers

Services

Repositories

Models

Incluye:

API REST completa

MongoDB Atlas

Mongoose

Swagger/OpenAPI

Manejo centralizado de errores

Validaciones de negocio

Sistema de logging Winston

Carga de archivos con Multer

Datos mock

Tests automatizados

Tecnologías utilizadas

Node.js

Express

MongoDB Atlas

Mongoose

dotenv

Swagger / OpenAPI

Winston

winston-daily-rotate-file

Multer

Mocha

Chai

Supertest

cross-env

ES Modules

Instalación

git clone https://github.com/AgustinMolini-hub/backend-main.git
cd backend-main
npm install

Variables de entorno

Crear:

.env

Ejemplo:

PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_db
NODE_ENV=development

Testing:

.env.test

Ejemplo:

PORT=8081
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_test
NODE_ENV=test

No subir:

.env
.env.test
node_modules/
uploads/
logs/

Arquitectura

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

Estructura actual

src/
├── config/
│   ├── database.js
│   ├── env.config.js
│   ├── logger.js
│   └── multer.config.js
├── controllers/
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── order.controller.js
│   ├── mock.controller.js
│   └── logger.controller.js
├── docs/
│   └── swagger.js
├── errors/
│   ├── app.error.js
│   └── error.dictionary.js
├── middlewares/
│   ├── error.middleware.js
│   └── upload-type.middleware.js
├── models/
├── repositories/
├── routes/
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── mock.routes.js
│   └── logger.routes.js
├── services/
├── app.js
└── server.js

API

Base:

http://localhost:8080

Health Check

GET:

/health

Respuesta:

{
 "status":"ok",
 "timestamp":"2026-08-29T00:00:00.000Z"
}

Users API

Base:

/api/users

Incluye:

Obtener usuarios

Crear usuarios

Validaciones

Subida de documentos

Products API

Base:

/api/products

Incluye:

Listado de productos

Creación

Validaciones

Estados:

AVAILABLE
OUT_OF_STOCK
DISCONTINUED

Orders API

Base:

/api/orders

Incluye:

Obtener pedidos

Crear pedidos

Buscar por ID

Actualizar estado

Subir comprobantes

Estados:

PENDING
CONFIRMED
IN_TRANSIT
DELIVERED
CANCELLED

Se corrigió:

Repository con lean()

Populate de usuario

Respuestas compatibles con tests

Mocks API (Módulo 6)

Base:

/api/mocks

Usuarios mock

GET /api/mocks/users

Ejemplo:

/api/mocks/users?qty=5

Drivers mock

GET /api/mocks/drivers

Datos completos

GET /api/mocks/all

Genera:

Usuarios

Drivers

Orders

Deliveries

Seed MongoDB

POST /api/mocks/seed

Inserta datos de prueba en MongoDB.

Implementado en:

src/services/mock.service.js

Logger API

Nuevo en Módulo 6.

Endpoint:

GET /api/logger

Archivos:

src/controllers/logger.controller.js
src/routes/logger.routes.js

Permite probar niveles Winston:

debug
http
info
warning
error
fatal

Swagger

Disponible en:

http://localhost:8080/api/docs

Incluye:

Endpoints

Modelos

Pruebas desde navegador

Corrección aplicada:

Swagger responde correctamente con HTTP 200.

Manejo de errores

Archivos:

src/errors/app.error.js
src/errors/error.dictionary.js
src/middlewares/error.middleware.js

Formato:

{
 "status":"error",
 "error":{
   "code":"ERROR_CODE",
   "message":"Mensaje"
 }
}

Logging

Configurado con Winston.

Archivo:

src/config/logger.js

Niveles:

fatal
error
warning
info
http
debug

Los logs utilizan rotación diaria.

Tests

Ejecutar:

npm test

Resultado actual:

26 passing

Incluye:

Health Check

Users API

Products API

Orders API

Mock API

Logger API

Swagger

Validaciones

Manejo de errores

Comandos

Desarrollo:

npm run dev

Producción:

npm start

Tests:

npm test

Estado actual del proyecto

✅ Express configurado
✅ MongoDB Atlas
✅ Mongoose
✅ Variables de entorno
✅ Arquitectura por capas
✅ Users API
✅ Products API
✅ Orders API
✅ Upload documentos
✅ Upload comprobantes
✅ Sistema Mock completo
✅ Seed MongoDB
✅ Logger Winston
✅ Logger API
✅ Swagger/OpenAPI
✅ Middleware global de errores
✅ Tests automatizados
✅ 26 pruebas aprobadas
