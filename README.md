ShipNow API

API REST de ShipNow desarrollada con Node.js, Express y MongoDB, utilizando una arquitectura por capas:

Controller → Service → Repository → Model → MongoDB


El proyecto incluye configuración de entorno validada, constantes de dominio, manejo centralizado de errores y un sistema de mocking para generar y cargar datos de prueba.

Tecnologías
Node.js
Express
MongoDB
Mongoose
dotenv
Arquitectura

El proyecto está organizado en capas para separar responsabilidades:

src/
├── config/
│   ├── database.js
│   └── env.config.js
├── constants/
│   └── index.js
├── controllers/
│   ├── product.controller.js
│   ├── user.controller.js
│   └── mock.controller.js
├── errors/
│   ├── app.error.js
│   └── error.dictionary.js
├── models/
│   ├── product.model.js
│   ├── user.model.js
│   ├── order.model.js
│   └── delivery.model.js
├── repositories/
│   ├── product.repository.js
│   ├── user.repository.js
│   └── mock.repository.js
├── routes/
│   ├── product.routes.js
│   ├── user.routes.js
│   └── mock.routes.js
└── services/
    ├── product.service.js
    ├── user.service.js
    └── mock.service.js

Controller

Gestiona las solicitudes HTTP y las respuestas.

Los Controllers no acceden directamente a MongoDB. Delegan la lógica de negocio en los Services.

Service

Contiene la lógica de negocio de la aplicación.

Los Services se encargan de:

Validar datos.
Aplicar reglas de negocio.
Generar datos simulados.
Coordinar operaciones con los Repositories.
Lanzar errores de aplicación mediante AppError.
Repository

Es la capa encargada de interactuar con los modelos de Mongoose.

Los Repositories realizan las operaciones de persistencia y no contienen lógica de negocio.

Model

Define los esquemas y validaciones de las entidades almacenadas en MongoDB.

Las principales entidades son:

User
Product
Order
Delivery
Manejo de errores

La API utiliza un sistema centralizado de manejo de errores mediante AppError.

Los códigos y mensajes de error se centralizan en:

src/errors/error.dictionary.js


El flujo de errores es:

Controller
    ↓
Service
    ↓
AppError
    ↓
Error Middleware
    ↓
Respuesta HTTP


Ejemplo de respuesta:

{
  "status": "error",
  "error": {
    "code": "INVALID_MOCK_QUANTITY",
    "message": "La cantidad de mocks debe ser un número entero mayor que cero.",
    "details": null
  }
}


Algunos de los códigos de error implementados son:

USER_NOT_FOUND
USER_ALREADY_EXISTS
INVALID_USER_DATA
PRODUCT_NOT_FOUND
INVALID_PRODUCT_DATA
INVALID_PRODUCT_PRICE
INVALID_MOCK_QUANTITY
NEGATIVE_MOCK_QUANTITY
MAX_MOCK_QUANTITY
MOCK_SEED_ERROR
DATABASE_ERROR
Configuración de entorno

Las variables de entorno se centralizan en:

src/config/env.config.js


Las variables requeridas son:

PORT=
MONGODB_URI=
NODE_ENV=


El archivo .env no debe subirse al repositorio.

Para comenzar, copiar:

.env.example


como:

.env


y completar los valores correspondientes.

Si falta una variable obligatoria, la aplicación muestra un error descriptivo y no inicia.

Instalación

Instalar las dependencias:

npm install


Crear el archivo .env a partir de .env.example:

cp .env.example .env


En Windows PowerShell también se puede utilizar:

Copy-Item .env.example .env


Completar las variables de entorno y ejecutar:

npm run dev

Endpoints principales
Health Check
GET /health


Verifica que la API esté funcionando correctamente.

Usuarios
GET /api/users
POST /api/users

Crear usuario

Ejemplo:

{
  "name": "Usuario de prueba",
  "email": "usuario@test.com"
}


El rol se asigna automáticamente como USER cuando no se proporciona un rol válido.

Si el email ya existe, la API devuelve un error:

{
  "status": "error",
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "message": "Ya existe un usuario registrado con este email.",
    "details": {
      "email": "usuario@test.com"
    }
  }
}

Productos

Obtener todos los productos:

GET /api/products


Obtener solamente productos disponibles:

GET /api/products?available=true


Obtener un producto por ID:

GET /api/products/:id


Crear un producto:

POST /api/products


Ejemplo:

{
  "name": "Producto de prueba",
  "price": 1500,
  "stock": 10
}


El estado del producto se determina automáticamente según el stock.

Si stock > 0:

AVAILABLE


Si stock = 0:

OUT_OF_STOCK

Sistema de Mocking

El sistema de mocking está disponible bajo:

/api/mocks


La generación y persistencia de datos está separada por capas:

Mock Router
     ↓
Mock Controller
     ↓
Mock Service
     ↓
Mock Repository
     ↓
MongoDB


Los endpoints GET generan datos simulados sin almacenarlos en MongoDB.

El endpoint POST /seed permite insertar datos de prueba de forma controlada.

Generar usuarios simulados
GET /api/mocks/users?qty=2


Ejemplo de respuesta:

[
  {
    "_id": "mock-id",
    "name": "Usuario Mock 1",
    "email": "usuario.mock@test.com",
    "role": "USER"
  },
  {
    "_id": "mock-id",
    "name": "Usuario Mock 2",
    "email": "usuario.mock@test.com",
    "role": "USER"
  }
]


Estos datos son simulados y no se almacenan en MongoDB.

Generar repartidores simulados
GET /api/mocks/drivers?qty=2


Los repartidores utilizan el rol definido en las constantes del proyecto:

ROLES.DRIVER


Estos datos tampoco se almacenan en MongoDB.

Generar un conjunto completo de datos simulados
GET /api/mocks/all?qty=3


Este endpoint genera:

Usuarios
Repartidores
Pedidos
Entregas

Los datos mantienen relaciones entre las entidades.

La relación conceptual es:

Usuario
   ↓
Pedido
   ↓
Entrega
   ↓
Repartidor


Los datos generados por este endpoint no se almacenan en MongoDB.

Validación del parámetro qty

El parámetro qty debe ser:

Un número.
Un número entero.
Mayor que cero.
Menor o igual a 100.

Ejemplos válidos:

GET /api/mocks/users?qty=1
GET /api/mocks/users?qty=3
GET /api/mocks/users?qty=100


Valores inválidos:

qty=0
qty=-5
qty=abc
qty=101
qty=1.5


Ejemplo de error para qty=0:

{
  "status": "error",
  "error": {
    "code": "INVALID_MOCK_QUANTITY",
    "message": "La cantidad de mocks debe ser un número entero mayor que cero.",
    "details": null
  }
}


Ejemplo de error para una cantidad negativa:

{
  "status": "error",
  "error": {
    "code": "NEGATIVE_MOCK_QUANTITY",
    "message": "La cantidad de mocks no puede ser negativa.",
    "details": null
  }
}


Ejemplo de error cuando se supera el máximo:

{
  "status": "error",
  "error": {
    "code": "MAX_MOCK_QUANTITY",
    "message": "La cantidad máxima de mocks permitida es 100.",
    "details": null
  }
}


Ejemplo de error para un valor no numérico:

{
  "status": "error",
  "error": {
    "code": "INVALID_MOCK_QUANTITY",
    "message": "La cantidad de mocks debe ser un número entero mayor que cero.",
    "details": null
  }
}


Si no se proporciona qty, se utiliza el valor 1 por defecto.

Cargar datos de prueba en MongoDB

Para insertar datos de prueba:

POST /api/mocks/seed?qty=5


También se puede probar desde PowerShell:

Invoke-RestMethod -Method POST "http://localhost:8080/api/mocks/seed?qty=5"


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

Los repartidores se generan en una cantidad controlada mediante:

Math.ceil(qty / 2)


garantizando al menos un repartidor.

Por ejemplo:

qty=2
users=2
drivers=1
orders=2
deliveries=2


El endpoint seed sí almacena los datos en MongoDB.

Relaciones entre entidades

Los datos insertados mediante POST /api/mocks/seed respetan las relaciones definidas por los modelos.

La estructura conceptual es:

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

Los pedidos creados.
Los usuarios con rol DRIVER.

La relación completa es:

Usuario
   │
   └── Pedido
          │
          └── Entrega
                 │
                 └── Repartidor

Constantes del dominio

Los valores permitidos se centralizan en:

src/constants/index.js


Incluyen:

Roles: ADMIN, USER, DRIVER
Estados de producto
Estados de pedido
Prioridades de pedido
Estados de entrega

Los objetos de constantes utilizan Object.freeze() para evitar modificaciones accidentales.

Separación entre Service y Repository

La lógica de negocio se mantiene en los Services.

Por ejemplo, MockService decide:

Cuántos usuarios generar.
Cuántos repartidores generar.
Qué roles utilizar.
Qué estados asignar.
Qué prioridades utilizar.
Cómo generar los totales de los pedidos.
Cómo relacionar pedidos y entregas.
Cómo coordinar la persistencia de los datos.

El MockRepository solamente se encarga de persistir los datos mediante los modelos de Mongoose.

De esta manera se evita colocar lógica de negocio dentro del Repository y se mantiene la separación:

Controller
    ↓
Service
    ↓
Repository
    ↓
Model
    ↓
MongoDB

Variables de entorno y seguridad

No subir nunca el archivo .env al repositorio.

El proyecto utiliza .gitignore para excluir:

.env
.env.local
.env.*.local
node_modules/


El repositorio debe contener únicamente .env.example con las claves necesarias y sin credenciales reales.

Ejemplos de pruebas
Mock users
Invoke-RestMethod "http://localhost:8080/api/mocks/users?qty=3"


Resultado esperado:

200 OK

Mock drivers
Invoke-RestMethod "http://localhost:8080/api/mocks/drivers?qty=3"


Resultado esperado:

200 OK

Mock completo
Invoke-RestMethod "http://localhost:8080/api/mocks/all?qty=3"


Resultado esperado:

200 OK

Cantidad negativa
Invoke-RestMethod "http://localhost:8080/api/mocks/users?qty=-5"


Resultado esperado:

NEGATIVE_MOCK_QUANTITY

Cantidad superior al máximo
Invoke-RestMethod "http://localhost:8080/api/mocks/users?qty=101"


Resultado esperado:

MAX_MOCK_QUANTITY

Cantidad no numérica
Invoke-RestMethod "http://localhost:8080/api/mocks/users?qty=abc"


Resultado esperado:

INVALID_MOCK_QUANTITY

Cantidad cero
Invoke-RestMethod "http://localhost:8080/api/mocks/users?qty=0"


Resultado esperado:

INVALID_MOCK_QUANTITY

Producto inexistente
Invoke-RestMethod "http://localhost:8080/api/products/000000000000000000000000"


Resultado esperado:

PRODUCT_NOT_FOUND

Producto inválido
Invoke-RestMethod `
  -Uri "http://localhost:8080/api/products" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{}'


Resultado esperado:

INVALID_PRODUCT_DATA

Precio inválido
Invoke-RestMethod `
  -Uri "http://localhost:8080/api/products" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Producto de prueba","price":-10}'


Resultado esperado:

INVALID_PRODUCT_PRICE

Usuario inválido
Invoke-RestMethod `
  -Uri "http://localhost:8080/api/users" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{}'


Resultado esperado:

INVALID_USER_DATA

Usuario duplicado
Invoke-RestMethod `
  -Uri "http://localhost:8080/api/users" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"name":"Usuario Prueba","email":"usuario.prueba@test.com"}'


Si el email ya existe:

USER_ALREADY_EXISTS

Seed
Invoke-RestMethod `
  -Uri "http://localhost:8080/api/mocks/seed?qty=2" `
  -Method POST


Resultado esperado:

201 Created

users: 2
drivers: 1
orders: 2
deliveries: 2

Ejecución

Una vez configurado el archivo .env:

npm run dev


La API estará disponible en:

http://localhost:8080


Health Check:

http://localhost:8080/health