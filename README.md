ShipNow API

API REST de ShipNow desarrollada con Node.js, Express y MongoDB, utilizando una arquitectura por capas:

Controller → Service → Repository

El proyecto incluye configuración de entorno validada, constantes de dominio y un sistema de mocking para generar y cargar datos de prueba.

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

Gestiona las solicitudes HTTP y las respuestas. No accede directamente a MongoDB.

Service

Contiene la lógica de negocio y la generación de datos simulados. Se comunica con los Repository.

Repository

Es la única capa que realiza operaciones sobre los modelos de Mongoose y MongoDB.

Model

Define los esquemas y validaciones de las entidades almacenadas en MongoDB.

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
Health check
GET /health


Verifica que la API esté funcionando.

Usuarios
GET /api/users
POST /api/users

Productos
GET /api/products
GET /api/products/:id
POST /api/products

Sistema de Mocking

El sistema de mocking está disponible bajo:

/api/mocks


La generación de datos está separada por capas:

Mock Router
    ↓
Mock Controller
    ↓
Mock Service
    ↓
Mock Repository
    ↓
MongoDB


Los endpoints GET generan datos simulados sin guardarlos en MongoDB.

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

Los repartidores se generan en una cantidad controlada para poder asociarlos a las entregas.

Relaciones entre entidades

Los datos insertados mediante POST /api/mocks/seed respetan las relaciones definidas por los modelos:

User
 ├── USER
 └── DRIVER

Order
 └── user → User._id

Delivery
 ├── order → Order._id
 └── driver → User._id


Los pedidos utilizan los _id reales de los usuarios creados en MongoDB.

Las entregas utilizan los _id reales de los pedidos y de los usuarios con rol DRIVER.

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

cuántos usuarios generar;
cuántos repartidores generar;
qué roles utilizar;
qué estados y prioridades asignar;
cómo relacionar pedidos y entregas.

El MockRepository solamente se encarga de persistir los datos mediante los modelos de Mongoose.

De esta manera se evita colocar lógica de negocio dentro del Repository y se mantiene la separación:

Controller → Service → Repository

Variables de entorno

No subir nunca el archivo .env al repositorio.

El proyecto utiliza .gitignore para excluir:

.env
.env.local
.env.*.local
node_modules/


El repositorio debe contener únicamente .env.example con las claves necesarias y sin credenciales reales.

Ejecución

Una vez configurado el .env:

npm run dev


La API estará disponible en:

http://localhost:8080


Health check:

http://localhost:8080/health