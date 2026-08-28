# ShipNow Backend

Backend REST API para **ShipNow**, desarrollado con Node.js, Express y MongoDB mediante Mongoose.

El proyecto implementa una arquitectura organizada por capas, manejo centralizado de errores, validaciones, documentación con Swagger, generación de datos mock y pruebas automatizadas con Mocha, Chai y Supertest.

---

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Mocha
- Chai
- Supertest
- Swagger / OpenAPI
- dotenv
- cross-env
- Morgan / Logger personalizado
- ES Modules

---

## Requisitos

Antes de ejecutar el proyecto se necesita tener instalado:

- Node.js
- npm
- Una cuenta de MongoDB Atlas

No es necesario tener MongoDB instalado localmente, ya que el proyecto utiliza MongoDB Atlas.

Para comprobar Node.js:

```bash
node --version

Para comprobar npm:

npm --version

Instalación
Clonar el repositorio:

git clone <URL_DEL_REPOSITORIO>

Ingresar al proyecto:

cd backend-main

Instalar dependencias:

npm install

Variables de entorno
El proyecto utiliza diferentes archivos .env según el entorno.

Desarrollo
Crear un archivo:

.env

Ejemplo:

PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/shipnow_db?retryWrites=true&w=majority
NODE_ENV=development

Reemplazar:

USUARIO
PASSWORD

por las credenciales correspondientes de MongoDB Atlas.

Testing
Crear:

.env.test

Ejemplo:

PORT=8081
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/shipnow_test?retryWrites=true&w=majority
NODE_ENV=test

Se recomienda utilizar una base de datos independiente para los tests:

shipnow_test

De esta manera los tests no modifican la base de datos utilizada por desarrollo.

Seguridad
Los archivos .env y .env.test contienen información sensible y no deben subirse al repositorio.

El .gitignore debe incluir:

node_modules/
.env
.env.test

Nunca publicar:

Contraseñas de MongoDB
Usuarios de MongoDB Atlas
Connection strings reales
API keys
Tokens
Credenciales
MongoDB Atlas
El proyecto utiliza MongoDB Atlas como base de datos.

La conexión se realiza mediante:

MONGODB_URI

Ejemplo:

mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/shipnow_db

La conexión está centralizada en:

src/config/database.js

La función principal es:

connectDB()

Cuando la conexión es exitosa se registra:

Conexión a MongoDB establecida

Si la conexión falla, el error es registrado y propagado para detener correctamente el proceso de inicio.

Configuración de entorno
La configuración se encuentra en:

src/config/env.config.js

El proyecto determina automáticamente qué archivo utilizar:

const envFile = process.env.NODE_ENV === 'test'
    ? '.env.test'
    : '.env';

Variables obligatorias:

PORT
MONGODB_URI
NODE_ENV

Si falta alguna variable requerida, la aplicación genera un error de configuración.

Ejecución
Desarrollo
Ejecutar:

npm run dev

El proyecto utiliza Node.js Watch Mode:

node --watch src/server.js

Por defecto, el servidor se inicia en:

http://localhost:8080

Si la conexión con MongoDB es correcta se mostrará:

Conexión a MongoDB establecida
Servidor ShipNow escuchando en el puerto 8080 en modo development

Producción
Ejecutar:

npm start

La configuración exacta depende del script definido en package.json.

Tests
Los tests están desarrollados utilizando:

Mocha
Chai
Supertest
Mongoose
Ejecutar todos los tests:

npm test

Actualmente el proyecto cuenta con:

18 passing

Los tests verifican:

Health check
Usuarios
Pedidos
Creación de usuarios
Creación de pedidos
Validaciones
Recursos inexistentes
Actualización de estados
Manejo de errores
Persistencia en MongoDB
Configuración global de tests
La configuración compartida se encuentra en:

test/setup.js

Este archivo se encarga de:

Establecer la conexión con MongoDB antes de ejecutar los tests.
Reutilizar la conexión existente.
Eliminar la base de datos de testing al finalizar.
Cerrar la conexión de Mongoose.
El script de tests utiliza:

mocha test/setup.js test/**/*.test.js --exit

Esto evita que cada archivo de test cree y cierre su propia conexión a MongoDB.

Arquitectura
El proyecto utiliza una arquitectura por capas:

src/
├── config/
├── constants/
├── controllers/
├── docs/
├── errors/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── app.js
└── server.js

Estructura del proyecto
backend-main/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── env.config.js
│   │   └── logger.js
│   │
│   ├── constants/
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   ├── user.controller.js
│   │   └── mock.controller.js
│   │
│   ├── docs/
│   │   └── swagger.js
│   │
│   ├── errors/
│   │   ├── app.error.js
│   │   └── error.dictionary.js
│   │
│   ├── middlewares/
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   ├── user.model.js
│   │   └── delivery.model.js
│   │
│   ├── repositories/
│   │   ├── mock.repository.js
│   │   ├── order.repository.js
│   │   ├── product.repository.js
│   │   └── user.repository.js
│   │
│   ├── routes/
│   │   ├── mock.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/
│   │   ├── mock.service.js
│   │   ├── order.service.js
│   │   ├── product.service.js
│   │   └── user.service.js
│   │
│   ├── app.js
│   └── server.js
│
├── test/
│   ├── setup.js
│   ├── health.test.js
│   ├── order.test.js
│   └── user.test.js
│
├── .env
├── .env.test
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

Arquitectura por capas
Routes
Las rutas definen los endpoints HTTP disponibles.

Ejemplo:

src/routes/user.routes.js

Las rutas delegan la operación al controller correspondiente.

Controllers
Los controllers reciben las solicitudes HTTP y devuelven las respuestas.

Ejemplo:

src/controllers/user.controller.js

Responsabilidades:

Recibir req
Procesar la solicitud
Invocar al service
Construir la respuesta HTTP
Propagar errores
Services
Los services contienen la lógica de negocio.

Ejemplo:

src/services/user.service.js

Responsabilidades:

Validaciones de negocio
Reglas de creación
Comprobación de duplicados
Asignación de valores por defecto
Comunicación con repositories
Repositories
Los repositories abstraen el acceso a MongoDB.

Ejemplo:

src/repositories/user.repository.js

Permiten separar la lógica de negocio de la persistencia.

Models
Los modelos representan las colecciones de MongoDB mediante Mongoose.

Ejemplos:

UserModel
ProductModel
OrderModel
DeliveryModel

API
Base URL:

http://localhost:8080

Health Check
GET /health
Permite comprobar que el servidor está funcionando.

Request:

GET /health

Response:

{
  "status": "ok",
  "timestamp": "2026-08-28T18:00:00.000Z"
}

Código:

200 OK

Users API
Base:

/api/users

Obtener usuarios
GET /api/users

Response:

{
  "status": "success",
  "payload": []
}

Crear usuario
POST /api/users

Body:

{
  "name": "Usuario Prueba",
  "email": "usuario.prueba@test.com",
  "role": "USER"
}

El campo role es opcional.

Roles disponibles:

ADMIN
USER
DRIVER

Si no se especifica un rol válido, se utiliza:

USER

Response:

{
  "status": "success",
  "payload": {
    "_id": "...",
    "name": "Usuario Prueba",
    "email": "usuario.prueba@test.com",
    "role": "USER"
  }
}

Código:

201 Created

Orders API
Base:

/api/orders

Obtener pedidos
GET /api/orders

Response:

{
  "status": "success",
  "payload": []
}

Crear pedido
POST /api/orders

Body:

{
  "user": "ID_DEL_USUARIO",
  "total": 2500,
  "priority": "HIGH"
}

Campos obligatorios:

user
total

Prioridades disponibles:

LOW
MEDIUM
HIGH

El estado inicial del pedido es:

PENDING

Response:

{
  "status": "success",
  "payload": {
    "_id": "...",
    "user": "...",
    "total": 2500,
    "priority": "HIGH",
    "status": "PENDING"
  }
}

Código:

201 Created

Obtener pedido por ID
GET /api/orders/:id

Ejemplo:

GET /api/orders/507f1f77bcf86cd799439011

Si existe:

200 OK

Si no existe:

404 Not Found

Error:

{
  "status": "error",
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Pedido no encontrado.",
    "details": {}
  }
}

Actualizar estado de pedido
PATCH /api/orders/:id/status

Body:

{
  "status": "CONFIRMED"
}

Estados disponibles:

PENDING
CONFIRMED
IN_TRANSIT
DELIVERED
CANCELLED

Response:

{
  "status": "success",
  "payload": {
    "_id": "...",
    "status": "CONFIRMED"
  }
}

Código:

200 OK

Products API
Base:

/api/products

Obtener productos
GET /api/products

También permite filtrar por disponibilidad:

GET /api/products?available=true

Obtener producto por ID
GET /api/products/:id

Crear producto
POST /api/products

Body:

{
  "name": "Producto de prueba",
  "price": 1500.50,
  "stock": 20,
  "status": "AVAILABLE"
}

Campos obligatorios:

name
price

El precio debe ser un número positivo.

Estados disponibles:

AVAILABLE
OUT_OF_STOCK
DISCONTINUED

Mocks API
La API de mocks permite generar datos de prueba para poblar la base de datos.

Base:

/api/mocks

Los mocks pueden generar:

Usuarios
Repartidores
Pedidos
Entregas
La lógica se encuentra principalmente en:

src/services/mock.service.js

La cantidad máxima permitida es:

100

Roles
Los roles disponibles son:

ADMIN
USER
DRIVER

Definidos en:

src/constants/index.js

Estados de pedidos
PENDING
CONFIRMED
IN_TRANSIT
DELIVERED
CANCELLED

Prioridades de pedidos
LOW
MEDIUM
HIGH

Estados de productos
AVAILABLE
OUT_OF_STOCK
DISCONTINUED

Estados de entregas
PENDING
ASSIGNED
IN_TRANSIT
DELIVERED
FAILED

Manejo de errores
El proyecto utiliza errores personalizados mediante:

src/errors/app.error.js

y un diccionario centralizado:

src/errors/error.dictionary.js

El middleware global se encuentra en:

src/middlewares/error.middleware.js

Formato de error
Las respuestas de error siguen una estructura común:

{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje descriptivo.",
    "details": {}
  }
}

Errores disponibles
Usuarios
USER_NOT_FOUND
INVALID_USER_DATA
USER_ALREADY_EXISTS

Pedidos
ORDER_NOT_FOUND
INVALID_ORDER_DATA
INVALID_ORDER_STATUS

Productos
INVALID_PRODUCT_DATA
INVALID_PRODUCT_PRICE
PRODUCT_NOT_FOUND

Mocks
INVALID_MOCK_QUANTITY
NEGATIVE_MOCK_QUANTITY
MAX_MOCK_QUANTITY
MOCK_SEED_ERROR

Base de datos
DATABASE_ERROR

Logging
El proyecto dispone de un logger centralizado:

src/config/logger.js

Se utilizan diferentes niveles de logging:

info
warning
error
fatal
debug

Ejemplos:

Conexión a MongoDB establecida

POST /api/users - INVALID_USER_DATA

Error al conectar con MongoDB

Swagger
La API dispone de documentación mediante Swagger/OpenAPI.

La documentación se encuentra disponible en:

http://localhost:8080/api/docs

Desde Swagger UI se pueden consultar y probar los endpoints disponibles.

Pruebas automatizadas
Actualmente los tests cubren principalmente:

Health
GET /health

Users
GET /api/users
POST /api/users

Incluyendo:

Creación exitosa
Lista vacía
Campos obligatorios
Email duplicado
Orders
GET /api/orders
POST /api/orders
GET /api/orders/:id
PATCH /api/orders/:id/status

Incluyendo:

Creación exitosa
Lista vacía
Usuario inexistente
Pedido inexistente
Estado válido
Estado inválido
Persistencia en MongoDB
Resultado actual:

18 passing

Comandos disponibles
Instalar dependencias:

npm install

Ejecutar en desarrollo:

npm run dev

Ejecutar tests:

npm test

Flujo recomendado de desarrollo
Configurar .env.
Verificar conexión con MongoDB Atlas.
Ejecutar:
npm run dev

Verificar:
GET http://localhost:8080/health

Abrir Swagger:
http://localhost:8080/api/docs

Antes de realizar un commit:
npm test

Confirmar que todos los tests pasen.
Estado actual del proyecto
El backend cuenta actualmente con:

 Express configurado
 MongoDB Atlas
 Mongoose
 Configuración mediante variables de entorno
 Separación de entorno development/test
 Arquitectura Routes / Controllers / Services / Repositories
 Modelos Mongoose
 API de usuarios
 API de pedidos
 API de productos
 API de mocks
 Manejo centralizado de errores
 Diccionario de errores
 Logging
 Swagger
 Health check
 Tests automatizados
 Setup global de MongoDB para tests
 Limpieza de base de datos de testing
 18 tests pasando
Checklist antes del commit
Ejecutar:

npm test

Resultado esperado:

18 passing

Verificar también que no se estén incluyendo credenciales:

git status

Los archivos .env y .env.test no deben formar parte del commit.

Finalmente:

git add .
git commit -m "test: complete users and orders API coverage"

Licencia
Proyecto desarrollado con fines educativos y/o de desarrollo de la plataforma ShipNow.


### Antes de hacer el commit

Como ya tenés:

```text
18 passing (4s)

yo haría exactamente esta comprobación final:

git status

Si .env o .env.test aparecen como archivos para agregar, no hagas el commit todavía. Hay que corregir el .gitignore.

Después:

npm test
git add .
git status
git commit -m "test: complete users and orders API coverage"