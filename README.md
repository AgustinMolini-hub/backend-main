ShipNow API

API REST de ShipNow desarrollada con Node.js, Express y MongoDB, utilizando una arquitectura por capas:

Controller → Service → Repository → Model → MongoDB


El proyecto incluye:

Configuración de entorno validada.
Arquitectura por capas.
Constantes de dominio.
Manejo centralizado de errores.
Sistema de mocking para generar y cargar datos de prueba.
Sistema de logging profesional con Winston.
Persistencia de logs de errores.
Rotación automática de archivos de logs.
Endpoint de prueba del sistema de logging.
Tecnologías
Node.js
Express
MongoDB
Mongoose
dotenv
Winston
winston-daily-rotate-file
Arquitectura

El proyecto está organizado en capas para separar responsabilidades:

src/
├── config/
│   ├── database.js
│   ├── env.config.js
│   └── logger.js
├── constants/
│   └── index.js
├── controllers/
│   ├── product.controller.js
│   ├── user.controller.js
│   └── mock.controller.js
├── errors/
│   ├── app.error.js
│   └── error.dictionary.js
├── middlewares/
│   └── error.middleware.js
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

No accede directamente a MongoDB y delega la lógica de negocio en los Services.

Service

Contiene la lógica de negocio y la generación de datos simulados.

Se comunica con los Repository.

Repository

Es la única capa que realiza operaciones sobre los modelos de Mongoose y MongoDB.

Model

Define los esquemas y validaciones de las entidades almacenadas en MongoDB.

Error

La aplicación utiliza una clase AppError para representar errores controlados de negocio.

Los códigos y mensajes disponibles se centralizan en:

src/errors/error.dictionary.js

Middleware de errores

El middleware global:

src/middlewares/error.middleware.js


centraliza el manejo de errores de la aplicación.

Los errores controlados devuelven respuestas consistentes al cliente, mientras que los errores inesperados se registran como errores internos del servidor.

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

Logging y monitoreo

ShipNow utiliza Winston como sistema centralizado de logging.

La configuración principal del logger se encuentra en:

src/config/logger.js


El objetivo es reemplazar los mensajes aislados mediante console.log(), console.error() u otros métodos similares por un sistema centralizado que permita clasificar y persistir los eventos importantes de la aplicación.

Niveles de log

La aplicación utiliza los siguientes niveles:

fatal: fallas críticas que pueden impedir el funcionamiento de la aplicación.
error: errores inesperados o errores importantes del servidor.
warning: situaciones anómalas o errores esperados de negocio.
info: eventos generales importantes de la aplicación.
http: eventos relacionados con solicitudes HTTP.
debug: información detallada utilizada principalmente durante el desarrollo.

Los niveles se encuentran definidos con una prioridad personalizada:

fatal
error
warning
info
http
debug

Comportamiento según el entorno

El logger adapta su comportamiento según la variable:

NODE_ENV=


En desarrollo se habilitan registros desde el nivel:

debug


Esto permite obtener información detallada durante las pruebas y el desarrollo.

En producción se utiliza un nivel más controlado:

info


De esta manera se reducen los registros de bajo nivel y se mantienen los eventos relevantes para monitoreo.

Salida por consola

Los mensajes se muestran en consola incluyendo:

Timestamp.
Nivel del log.
Mensaje.

Ejemplo:

2026-08-28 16:50:06 [info] Servidor ShipNow escuchando en el puerto 8080 en modo development
2026-08-28 16:50:06 [info] Conexión a MongoDB establecida
2026-08-28 16:50:20 [warning] Cantidad de mocks inválida: 0
2026-08-28 16:50:20 [error] Prueba de logger - nivel ERROR
2026-08-28 16:50:20 [fatal] Prueba de logger - nivel FATAL


En desarrollo, los niveles debug, http, info, warning, error y fatal pueden visualizarse en consola.

Persistencia de errores

Los errores importantes se almacenan automáticamente dentro de:

logs/


Los archivos utilizan el formato:

logs/error-YYYY-MM-DD.log


Por ejemplo:

logs/error-2026-08-28.log


El archivo de errores contiene los niveles:

error
fatal


Por ejemplo:

2026-08-28 16:50:06 [error] Prueba de logger - nivel ERROR
2026-08-28 16:50:06 [fatal] Prueba de logger - nivel FATAL


Los niveles info, debug, http y warning no se almacenan en este archivo.

Rotación de archivos

Para evitar que los archivos de logs crezcan sin control se utiliza:

winston-daily-rotate-file


La configuración actual:

Rotación diaria.
Máximo de 14 días de conservación.
Tamaño máximo de 10 MB por archivo.

Los archivos se generan automáticamente utilizando la fecha:

error-YYYY-MM-DD.log


Esto permite mantener un historial ordenado y evitar archivos de tamaño excesivo.

Logs y Git

Los archivos generados por la aplicación no deben subirse al repositorio.

La carpeta:

logs/


está incluida en .gitignore.

También se ignoran:

node_modules/
.env
.env.local
.env.*.local


Los logs generados localmente permanecen únicamente en el entorno donde se ejecuta la aplicación.

Integración del logger

El logger se utiliza en distintos puntos importantes de ShipNow.

Actualmente registra eventos relacionados con:

Inicio correcto del servidor.
Error durante el inicio del servidor.
Conexión exitosa a MongoDB.
Error crítico durante la conexión a MongoDB.
Errores controlados mediante el middleware global.
Errores inesperados del servidor.
Validación de cantidades del sistema de mocks.
Generación de usuarios mock.
Generación de repartidores mock.
Generación de datos simulados.
Inicio del proceso de seed.
Finalización correcta del seed.
Errores durante el seed.
Prueba de todos los niveles del logger.

El logger complementa el manejo centralizado de errores y permite investigar problemas internos sin modificar la respuesta que recibe el cliente.

Endpoint de prueba del logger

Para verificar que todos los niveles del sistema de logging funcionan correctamente se agregó un endpoint de prueba:

GET /api/mocks/logger-test


Este endpoint no representa una funcionalidad real del negocio.

Su objetivo es facilitar la validación del sistema de logging.

Probar desde PowerShell

Con el servidor ejecutándose:

Invoke-RestMethod `
  -Uri "http://localhost:8080/api/mocks/logger-test" `
  -Method GET


Respuesta esperada:

{
  "status": "success",
  "message": "Prueba de logger ejecutada correctamente."
}


El endpoint genera mensajes para todos los niveles configurados:

debug
http
info
warning
error
fatal


Los niveles error y fatal deben quedar registrados en:

logs/error-YYYY-MM-DD.log

Endpoints principales
Health check
GET /health


Verifica que la API esté funcionando.

Ejemplo:

http://localhost:8080/health

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

Usuarios.
Repartidores.
Pedidos.
Entregas.

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

Los repartidores se generan en una cantidad controlada para poder asociarlos a las entregas.

Durante el proceso se registran eventos relevantes mediante Winston.

Relaciones entre entidades

Los datos insertados mediante:

POST /api/mocks/seed


respetan las relaciones definidas por los modelos:

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

Validación de mocks

El sistema valida la cantidad solicitada para los mocks.

La cantidad debe ser:

Un número.
Un número entero.
Mayor que cero.
Menor o igual a 100.

Ejemplo de cantidad inválida:

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


Si se supera el máximo permitido:

POST /api/mocks/seed?qty=101


se devuelve un error controlado indicando que el máximo permitido es 100.

Estos eventos también son registrados mediante el logger como warning.

Constantes del dominio

Los valores permitidos se centralizan en:

src/constants/index.js


Incluyen:

Roles: ADMIN, USER, DRIVER.
Estados de producto.
Estados de pedido.
Prioridades de pedido.
Estados de entrega.

Los objetos de constantes utilizan Object.freeze() para evitar modificaciones accidentales.

Separación entre Service y Repository

La lógica de negocio se mantiene en los Services.

Por ejemplo, MockService decide:

Cuántos usuarios generar.
Cuántos repartidores generar.
Qué roles utilizar.
Qué estados y prioridades asignar.
Cómo relacionar pedidos y entregas.
Cómo validar la cantidad solicitada.
Cómo realizar el proceso de seed.

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
logs/


El repositorio debe contener únicamente .env.example con las claves necesarias y sin credenciales reales.

Ejecución

Una vez configurado el .env:

npm run dev


La API estará disponible en:

http://localhost:8080


Health check:

http://localhost:8080/health


Para ejecutar la aplicación en modo normal:

npm start

Estado del proyecto

ShipNow cuenta actualmente con:

Arquitectura por capas.
Controllers.
Services.
Repositories.
Models de Mongoose.
Configuración de entorno.
Constantes de dominio.
Manejo centralizado de errores.
Sistema de mocking.
Persistencia de datos de prueba.
Logger centralizado con Winston.
Niveles debug, http, info, warning, error y fatal.
Persistencia de errores en archivos.
Rotación automática de logs.
Endpoint de prueba del logger.
.gitignore configurado para evitar subir credenciales, dependencias y logs generados.