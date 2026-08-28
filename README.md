# ShipNow API

API REST de **ShipNow** desarrollada con **Node.js, Express y MongoDB**, utilizando una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento del proyecto.

Arquitectura principal:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
    ↓
MongoDB

Tecnologías
Node.js
Express
MongoDB
Mongoose
dotenv
Winston
winston-daily-rotate-file
Swagger / OpenAPI
swagger-jsdoc
swagger-ui-express
Características principales
El proyecto incluye:

Arquitectura por capas.
Controllers.
Services.
Repositories.
Models de Mongoose.
Configuración mediante variables de entorno.
Constantes de dominio.
Manejo centralizado de errores.
Sistema de mocking.
Generación de usuarios simulados.
Generación de repartidores simulados.
Generación de pedidos y entregas relacionadas.
Carga de datos mock en MongoDB.
Sistema centralizado de logging con Winston.
Persistencia de errores en archivos.
Rotación automática de archivos de logs.
Endpoint de prueba del logger.
Documentación de la API mediante Swagger.
Swagger UI disponible desde /api/docs.
.gitignore configurado para evitar subir credenciales, dependencias y logs.
Arquitectura del proyecto
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
│   │   ├── product.model.js
│   │   ├── user.model.js
│   │   ├── order.model.js
│   │   └── delivery.model.js
│   │
│   ├── repositories/
│   │   ├── product.repository.js
│   │   ├── user.repository.js
│   │   └── mock.repository.js
│   │
│   ├── routes/
│   │   ├── product.routes.js
│   │   ├── user.routes.js
│   │   └── mock.routes.js
│   │
│   ├── services/
│   │   ├── product.service.js
│   │   ├── user.service.js
│   │   └── mock.service.js
│   │
│   ├── app.js
│   └── server.js
│
├── logs/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

Arquitectura por capas
Controller
Los Controllers gestionan las solicitudes HTTP y las respuestas.

No acceden directamente a MongoDB.

Delegan la lógica de negocio en los Services.

HTTP Request
     ↓
Controller
     ↓
Service

Service
Los Services contienen la lógica de negocio de la aplicación.

Se encargan de tareas como:

Validación de datos.
Validación de cantidades.
Determinación de estados.
Generación de datos mock.
Relaciones entre usuarios, pedidos y entregas.
Procesos de seed.
Los Services utilizan los Repositories para acceder a los datos.

Controller
     ↓
Service
     ↓
Repository

Repository
Los Repositories son responsables de las operaciones de persistencia.

Son la capa que interactúa con los modelos de Mongoose.

ProductRepository
       ↓
ProductModel
       ↓
MongoDB

Model
Los Models de Mongoose definen los esquemas de las entidades almacenadas en MongoDB.

Actualmente existen modelos para:

User
Product
Order
Delivery
Configuración de entorno
Las variables de entorno se centralizan en:

src/config/env.config.js

Variables principales:

PORT=
MONGODB_URI=
NODE_ENV=

El archivo .env no debe subirse al repositorio porque puede contener información sensible.

El repositorio debe contener:

.env.example

sin credenciales reales.

Instalación
Acceder a la carpeta del proyecto:

cd backend-main

Instalar las dependencias:

npm install

Crear el archivo .env utilizando .env.example.

En PowerShell:

Copy-Item .env.example .env

Completar las variables de entorno correspondientes.

Ejecución
Para ejecutar el proyecto en modo desarrollo:

npm run dev

El proyecto utiliza Node.js con --watch, por lo que los cambios realizados durante el desarrollo pueden provocar el reinicio automático del servidor.

Para ejecutar la aplicación normalmente:

npm start

Por defecto, la API se ejecuta en:

http://localhost:8080

Health Check
La aplicación dispone de un endpoint para verificar que el servidor está funcionando correctamente.

GET /health

URL:

http://localhost:8080/health

Respuesta esperada:

{
  "status": "ok",
  "timestamp": "2026-08-28T20:00:00.000Z"
}

Documentación Swagger
La API está documentada utilizando:

OpenAPI 3.0.3
swagger-jsdoc
swagger-ui-express
La configuración se encuentra en:

src/docs/swagger.js

La documentación está disponible en:

http://localhost:8080/api/docs

Swagger permite visualizar y probar los endpoints directamente desde la interfaz web.

Verificar Swagger desde PowerShell
Con el servidor ejecutándose:

Invoke-WebRequest `
  "http://localhost:8080/api/docs" `
  -UseBasicParsing |
  Select-Object StatusCode

Respuesta esperada:

StatusCode
----------
200

Usuarios
Obtener usuarios
GET /api/users

Devuelve todos los usuarios registrados en MongoDB.

PowerShell:

Invoke-RestMethod `
  -Uri "http://localhost:8080/api/users" `
  -Method GET

Crear usuario
POST /api/users

Ejemplo:

{
  "name": "Usuario Prueba",
  "email": "usuario.prueba@test.com",
  "role": "USER"
}

Los roles disponibles son:

ADMIN
USER
DRIVER

Si no se proporciona un rol válido, se utiliza:

USER

Productos
Obtener productos
GET /api/products

También permite filtrar productos disponibles:

GET /api/products?available=true

Obtener producto por ID
GET /api/products/:id

Ejemplo:

GET /api/products/66b7c2f9a123456789abcdef

Crear producto
POST /api/products

Ejemplo:

{
  "name": "Producto de prueba",
  "price": 1500.50,
  "stock": 20
}

El estado del producto se determina automáticamente según el stock.

Si:

stock > 0

el estado será:

AVAILABLE

Si:

stock = 0

el estado será:

OUT_OF_STOCK

Sistema de Mocking
El sistema de mocking permite generar datos de prueba sin necesidad de almacenarlos en MongoDB.

Los endpoints se encuentran bajo:

/api/mocks

Arquitectura:

Mock Router
     ↓
Mock Controller
     ↓
Mock Service
     ↓
Mock Repository
     ↓
MongoDB

Los endpoints GET generan datos en memoria.

El endpoint POST /seed permite almacenar los datos generados en MongoDB.

Generar usuarios simulados
GET /api/mocks/users

Ejemplo:

GET /api/mocks/users?qty=2

PowerShell:

Invoke-RestMethod `
  -Uri "http://localhost:8080/api/mocks/users?qty=2" `
  -Method GET

Ejemplo de respuesta:

[
  {
    "_id": "mock-id",
    "name": "Usuario Mock 1",
    "email": "usuario.mock.123@test.com",
    "role": "USER"
  },
  {
    "_id": "mock-id",
    "name": "Usuario Mock 2",
    "email": "usuario.mock.123@test.com",
    "role": "USER"
  }
]

Estos datos no se almacenan en MongoDB.

Generar repartidores simulados
GET /api/mocks/drivers

Ejemplo:

GET /api/mocks/drivers?qty=2

PowerShell:

Invoke-RestMethod `
  -Uri "http://localhost:8080/api/mocks/drivers?qty=2" `
  -Method GET

Los repartidores utilizan el rol:

DRIVER

Estos datos tampoco se almacenan en MongoDB.

Generar datos mock completos
GET /api/mocks/all

Ejemplo:

GET /api/mocks/all?qty=3

Este endpoint genera:

Usuarios.
Repartidores.
Pedidos.
Entregas.
Las relaciones conceptuales son:

User
  ↓
Order
  ↓
Delivery
  ↓
Driver

Los datos se generan en memoria y no se almacenan en MongoDB.

Seed de datos mock
Para insertar datos de prueba en MongoDB:

POST /api/mocks/seed

Ejemplo:

POST /api/mocks/seed?qty=5

PowerShell:

Invoke-RestMethod `
  -Method POST `
  "http://localhost:8080/api/mocks/seed?qty=5"

Ejemplo de respuesta:

{
  "status": "success",
  "message": "Datos de prueba insertados correctamente.",
  "users": 5,
  "drivers": 3,
  "orders": 5,
  "deliveries": 5
}

El parámetro qty controla la cantidad de usuarios y pedidos generados.

La cantidad de repartidores se calcula de forma independiente para poder asociarlos a las entregas.

Relaciones del Seed
Cuando se ejecuta:

POST /api/mocks/seed

los datos se insertan respetando las relaciones entre las entidades.

User
├── USER
└── DRIVER

Order
└── user → User._id

Delivery
├── order → Order._id
└── driver → User._id

Los pedidos utilizan los _id reales de los usuarios creados en MongoDB.

Las entregas utilizan los _id reales de:

Pedidos.
Usuarios con rol DRIVER.
Validación de cantidad de mocks
El sistema valida el parámetro qty.

La cantidad debe ser:

Un número.
Un número entero.
Mayor que cero.
Menor o igual a 100.
Valores válidos:

1
2
5
50
100

Valores inválidos:

0
-1
1.5
101

Ejemplo:

POST /api/mocks/seed?qty=0

Respuesta:

{
  "status": "error",
  "error": {
    "code": "INVALID_MOCK_QUANTITY",
    "message": "La cantidad de mocks debe ser un número entero mayor que cero.",
    "details": null
  }
}

Si se supera el máximo:

POST /api/mocks/seed?qty=101

se devuelve:

MAX_MOCK_QUANTITY

Manejo centralizado de errores
La aplicación utiliza:

src/errors/app.error.js

La clase:

AppError

permite representar errores controlados de negocio.

Los códigos y mensajes están centralizados en:

src/errors/error.dictionary.js

Algunos códigos disponibles son:

USER_NOT_FOUND
ORDER_NOT_FOUND
INVALID_ORDER_STATUS
INVALID_PRODUCT_DATA
INVALID_PRODUCT_PRICE
PRODUCT_NOT_FOUND
INVALID_USER_DATA
USER_ALREADY_EXISTS
INVALID_MOCK_QUANTITY
NEGATIVE_MOCK_QUANTITY
MAX_MOCK_QUANTITY
MOCK_SEED_ERROR
DATABASE_ERROR

Middleware global de errores
El manejo de errores se centraliza en:

src/middlewares/error.middleware.js

Los errores controlados devuelven una respuesta consistente.

Ejemplo:

{
  "status": "error",
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Producto no encontrado.",
    "details": {
      "id": "66b7c2f9a123456789abcdef"
    }
  }
}

Los errores inesperados devuelven:

{
  "status": "error",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Ocurrió un error interno del servidor."
  }
}

Constantes del dominio
Los valores permitidos se centralizan en:

src/constants/index.js

Roles
ADMIN
USER
DRIVER

Estados de producto
AVAILABLE
OUT_OF_STOCK
DISCONTINUED

Estados de pedido
PENDING
CONFIRMED
IN_TRANSIT
DELIVERED
CANCELLED

Prioridades de pedido
LOW
MEDIUM
HIGH

Estados de entrega
PENDING
ASSIGNED
IN_TRANSIT
DELIVERED
FAILED

Las constantes utilizan Object.freeze() para evitar modificaciones accidentales.

Logging
ShipNow utiliza Winston como sistema centralizado de logging.

La configuración se encuentra en:

src/config/logger.js

Los niveles utilizados son:

fatal
error
warning
info
http
debug

Prioridad:

fatal
error
warning
info
http
debug

Niveles de logging
fatal
Fallas críticas que pueden impedir el funcionamiento de la aplicación.

error
Errores inesperados o errores importantes del servidor.

warning
Situaciones anómalas o errores esperados de negocio.

info
Eventos generales importantes de la aplicación.

http
Eventos relacionados con solicitudes HTTP.

debug
Información detallada utilizada principalmente durante el desarrollo.

Logging según el entorno
El comportamiento depende de:

NODE_ENV=

En desarrollo se habilitan registros desde:

debug

En producción se utiliza:

info

Esto permite reducir los registros de bajo nivel en producción.

Salida por consola
Los mensajes incluyen:

Timestamp.
Nivel.
Mensaje.
Ejemplo:

2026-08-28 17:15:47 [info] Conexión a MongoDB establecida
2026-08-28 17:16:10 [warning] Cantidad de mocks inválida: 0
2026-08-28 17:16:20 [error] Prueba de logger - nivel ERROR
2026-08-28 17:16:20 [fatal] Prueba de logger - nivel FATAL

Persistencia de errores
Los niveles:

error
fatal

se almacenan automáticamente en:

logs/

Los archivos utilizan el formato:

error-YYYY-MM-DD.log

Ejemplo:

logs/error-2026-08-28.log

Rotación de logs
El proyecto utiliza:

winston-daily-rotate-file

Configuración:

Rotación diaria.
Conservación máxima de 14 días.
Tamaño máximo de 10 MB por archivo.
Logs y Git
Los archivos generados por la aplicación no deben subirse al repositorio.

Se excluye:

logs/

También se excluyen:

node_modules/
.env
.env.local
.env.*.local
logs/

Endpoint de prueba del logger
Existe un endpoint para verificar que los niveles del logger funcionen correctamente:

GET /api/mocks/logger-test

Este endpoint es una herramienta interna de validación y no representa una funcionalidad real del negocio.

Probar el logger
Con el servidor ejecutándose:

Invoke-RestMethod `
  -Uri "http://localhost:8080/api/mocks/logger-test" `
  -Method GET

Respuesta esperada:

{
  "status": "success",
  "message": "Prueba de logger ejecutada correctamente."
}

El endpoint genera mensajes para:

debug
http
info
warning
error
fatal

Los niveles error y fatal deben quedar registrados en:

logs/error-YYYY-MM-DD.log

Endpoints principales
Health
GET /health

Users
GET /api/users
POST /api/users

Products
GET /api/products
GET /api/products/:id
POST /api/products

Mocks
GET /api/mocks/users
GET /api/mocks/drivers
GET /api/mocks/all
GET /api/mocks/logger-test
POST /api/mocks/seed

Swagger
GET /api/docs

Resumen de endpoints
Método	Endpoint	Descripción
GET	/health	Verifica el estado de la API
GET	/api/users	Obtiene usuarios
POST	/api/users	Crea un usuario
GET	/api/products	Obtiene productos
GET	/api/products/:id	Obtiene un producto
POST	/api/products	Crea un producto
GET	/api/mocks/users	Genera usuarios mock
GET	/api/mocks/drivers	Genera repartidores mock
GET	/api/mocks/all	Genera datos mock relacionados
GET	/api/mocks/logger-test	Prueba el sistema de logging
POST	/api/mocks/seed	Inserta datos mock en MongoDB
GET	/api/docs	Abre la documentación Swagger

Ejemplos rápidos
Levantar servidor
npm run dev

Verificar API
Invoke-RestMethod "http://localhost:8080/health"

Obtener usuarios
Invoke-RestMethod "http://localhost:8080/api/users"

Obtener productos
Invoke-RestMethod "http://localhost:8080/api/products"

Generar mocks
Invoke-RestMethod "http://localhost:8080/api/mocks/all?qty=3"

Insertar mocks en MongoDB
Invoke-RestMethod `
  -Method POST `
  "http://localhost:8080/api/mocks/seed?qty=5"

Probar logger
Invoke-RestMethod `
  "http://localhost:8080/api/mocks/logger-test"

Abrir Swagger
http://localhost:8080/api/docs

Buenas prácticas
El proyecto mantiene las siguientes reglas:

Los Controllers no acceden directamente a MongoDB.
La lógica de negocio se mantiene en los Services.
El acceso a datos se realiza mediante Repositories.
Los Models de Mongoose definen la estructura de los datos.
Los errores de negocio utilizan AppError.
Los códigos de error se centralizan en error.dictionary.js.
Los valores de dominio se centralizan en constants/index.js.
Las credenciales se mantienen fuera del repositorio.
Los logs generados no se suben a Git.
La documentación de la API se mantiene mediante Swagger.
Flujo general de la aplicación
Cliente HTTP
     ↓
Route
     ↓
Controller
     ↓
Service
     ↓
Repository
     ↓
Model
     ↓
MongoDB

Para el sistema de mocks:

Cliente HTTP
     ↓
Mock Route
     ↓
Mock Controller
     ↓
Mock Service
     ↓
Mock Repository
     ↓
MongoDB

Los endpoints GET de mocks generan datos en memoria.

El endpoint:

POST /api/mocks/seed

persiste los datos generados en MongoDB.

Git
Antes de realizar un commit:

git status

Agregar los cambios:

git add .

Verificar nuevamente:

git status

Realizar el commit:

git commit -m "docs: update README and Swagger documentation"

Subir los cambios:

git push origin main

Importante
No subir nunca al repositorio:

.env
node_modules/
logs/

El archivo:

.env.example

sí debe mantenerse en el repositorio, pero sin credenciales reales.

Estado actual del proyecto
ShipNow cuenta actualmente con:

Arquitectura por capas.
Controllers.
Services.
Repositories.
Models de Mongoose.
MongoDB.
Configuración mediante variables de entorno.
Constantes de dominio.
Manejo centralizado de errores.
Sistema de mocking.
Generación de usuarios y repartidores mock.
Generación de pedidos y entregas relacionadas.
Persistencia de datos de prueba.
Logger centralizado con Winston.
Niveles debug, http, info, warning, error y fatal.
Persistencia de errores.
Rotación automática de logs.
Endpoint de prueba del logger.
Documentación OpenAPI 3.0.3.
Swagger UI.
.gitignore configurado para evitar subir dependencias, credenciales y logs.
ShipNow
API REST desarrollada con Node.js, Express y MongoDB, organizada mediante arquitectura por capas y acompañada de documentación OpenAPI, sistema de mocking, manejo centralizado de errores y logging profesional.