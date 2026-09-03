ShipNow Backend

Backend REST API para ShipNow, desarrollado con Node.js,
Express y MongoDB, utilizando Mongoose.

El proyecto utiliza una arquitectura por capas:

Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Models
  ↓
MongoDB

Funcionalidades

API REST

MongoDB Atlas y Mongoose

Arquitectura por capas

Manejo centralizado de errores

Validaciones de negocio

Logging con Winston

Rotación diaria de logs

Carga de archivos con Multer

Validación de tipos MIME

Límite de tamaño de archivos

Limpieza de archivos cuando una carga es rechazada

Datos mock y seed

Swagger/OpenAPI

Tests automatizados

Configuración diferenciada para testing

Variables de entorno con dotenv

ES Modules

Tecnologías

Node.js

Express

MongoDB Atlas

Mongoose

dotenv

Swagger / OpenAPI

Winston

winston-daily-rotate-file

Multer 2.2.0

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

Desarrollo

Crear .env:

PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_db
NODE_ENV=development

Testing

Crear .env.test:

PORT=8081
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_test
NODE_ENV=test

La configuración de testing permite utilizar una base de datos separada
de la utilizada durante la ejecución normal.

Los tests necesitan una instancia de MongoDB accesible mediante
MONGODB_URI. Puede utilizarse una base local o una instancia de
MongoDB Atlas destinada a testing.

Pasos para ejecutar los tests desde una instalación limpia

Ejecutar npm install.

Crear/configurar .env.test.

Asegurarse de que la instancia de MongoDB indicada en MONGODB_URI
esté disponible.

Ejecutar npm test.

No subir al repositorio:

.env
.env.test
node_modules/
uploads/
logs/

Arquitectura

Routes: endpoints HTTP.

Controllers: manejo de solicitudes y respuestas HTTP.

Services: lógica y validaciones de negocio.

Repositories: acceso a MongoDB.

Models: esquemas de Mongoose.

Middlewares: procesamiento transversal, especialmente errores y
uploads.

Constants: valores reutilizados por las distintas capas.

Errors: errores de aplicación y respuestas centralizadas.

¿Por qué separar Service y Repository?

La separación entre Service y Repository permite mantener las
reglas de negocio separadas de la persistencia.

El Service contiene las decisiones y validaciones del dominio:
valida datos, comprueba recursos, aplica reglas y coordina las
operaciones necesarias.

El Repository encapsula el acceso a MongoDB mediante Mongoose y se
ocupa de consultar, crear o actualizar los datos.

Esta separación:

reduce el acoplamiento entre la lógica de negocio y MongoDB;

evita colocar lógica de persistencia en controllers;

permite reutilizar operaciones de acceso a datos;

facilita el mantenimiento y las pruebas;

permite modificar la persistencia con menor impacto sobre las reglas
de negocio;

mantiene responsabilidades claras entre las capas.

Estructura

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

Constants

Los valores reutilizados se centralizan en:

src/constants/index.js

Incluye:

ROLES
ORDER_STATUS
ORDER_PRIORITY
PRODUCT_STATUS
DELIVERY_STATUS
DOCUMENT_TYPES

Ejemplo:

export const DOCUMENT_TYPES = Object.freeze({
    DNI: 'DNI',
    LICENSE: 'LICENSE',
    OTHER: 'OTHER'
});

En los lugares que necesitan la lista completa de tipos válidos puede
utilizarse:

Object.values(DOCUMENT_TYPES)

Esto evita repetir strings literales como DNI, LICENSE y OTHER en
la lógica de la aplicación y mantiene una única fuente de verdad.

API

URL base:

http://localhost:8080

Health Check

GET /health

Ejemplo de respuesta:

{
  "status": "ok",
  "timestamp": "2026-08-29T00:00:00.000Z"
}

Users API

Base:

/api/users

Incluye:

Obtener usuarios

Crear usuarios

Obtener usuario por ID

Validaciones

Subida de documentos

Crear usuario

POST /api/users

Ejemplo:

{
  "name": "Usuario Test",
  "email": "usuario.test@test.com"
}

Documentos de usuario

POST /api/users/:id/documents

Tipos centralizados mediante DOCUMENT_TYPES:

DNI
LICENSE
OTHER

MIME permitidos:

application/pdf
image/jpeg
image/png

Límite:

5 MB

Se controlan:

Archivo inexistente

Usuario inexistente

ID inválido

Tipo de documento inválido

MIME no permitido

Campo de archivo incorrecto

Archivo demasiado grande

Si una carga es rechazada después de crear un archivo temporal, el
archivo se elimina cuando corresponde.

Destino:

uploads/users/

Products API

Base:

/api/products

Incluye listado, creación, validaciones y manejo de productos
inexistentes.

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

Validaciones de usuario e IDs

Manejo de pedidos inexistentes

Estados:

PENDING
CONFIRMED
IN_TRANSIT
DELIVERED
CANCELLED

Prioridades:

LOW
MEDIUM
HIGH

Crear pedido

POST /api/orders

Ejemplo:

{
  "user": "ID_DEL_USUARIO",
  "total": 2500,
  "priority": "HIGH"
}

El estado inicial es PENDING.

Se valida:

Datos obligatorios

Formato del ID del usuario

Existencia del usuario

Tipo y valor de total

Prioridad

Obtener pedidos

GET /api/orders

Obtener por ID

GET /api/orders/:id

Actualizar estado

PATCH /api/orders/:id/status

Ejemplo:

{
  "status": "CONFIRMED"
}

Comprobantes

POST /api/orders/:id/receipt

MIME permitidos:

application/pdf
image/jpeg
image/png

Límite:

5 MB

Destino:

uploads/receipts/

La aplicación contempla la limpieza de archivos cuando una carga es
rechazada después de haber creado el archivo.

Mocks API

Base:

/api/mocks

Usuarios

GET /api/mocks/users

Ejemplo:

/api/mocks/users?qty=5

Drivers

GET /api/mocks/drivers

Datos completos

GET /api/mocks/all

Genera datos relacionados de:

Users

Drivers

Orders

Deliveries

Seed

POST /api/mocks/seed

Inserta datos de prueba en MongoDB.

Implementación principal:

src/services/mock.service.js

Las cantidades inválidas o negativas son rechazadas.

Logger API

GET /api/logger

Permite probar:

debug
http
info
warning
error
fatal

Archivos relacionados:

src/controllers/logger.controller.js
src/routes/logger.routes.js
src/config/logger.js

La ruta importa y utiliza el controlador específico del logger.

Logging

Configurado con:

Winston

winston-daily-rotate-file

Archivo:

src/config/logger.js

Niveles:

fatal
error
warning
info
http
debug

Los logs utilizan rotación diaria y el directorio logs/ queda fuera
del repositorio.

Manejo de errores

Archivos:

src/errors/app.error.js
src/errors/error.dictionary.js
src/middlewares/error.middleware.js

Formato general:

{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje",
    "details": {}
  }
}

Errores controlados actualmente incluyen, entre otros:

INVALID_USER_DATA
USER_ALREADY_EXISTS
INVALID_USER_ID
USER_NOT_FOUND
INVALID_ORDER_DATA
INVALID_ORDER_ID
ORDER_NOT_FOUND
INVALID_ORDER_STATUS
PRODUCT_NOT_FOUND
FILE_REQUIRED
INVALID_FILE_TYPE
INVALID_DOCUMENT_TYPE
NEGATIVE_MOCK_QUANTITY

También se contemplan errores provenientes de Multer, por ejemplo:

File too large
Unexpected field
INVALID_FILE_TYPE

Validación de IDs

Los IDs se validan antes de consultar MongoDB cuando corresponde.

Ejemplo:

if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('INVALID_ORDER_ID', {
        orderId: id
    });
}

Esto evita que IDs con formato inválido lleguen a Mongoose y provoquen
errores de casting que terminen como HTTP 500.

También se valida el ID del usuario recibido durante la creación de un
pedido, permitiendo devolver un error controlado en lugar de un
CastError.

Pruebas manuales de errores

Además de los tests automatizados, pueden utilizarse solicitudes
reproducibles para comprobar el manejo global de errores.

Los ejemplos utilizan:

http://localhost:8080

Cantidad negativa en mocks

curl "http://localhost:8080/api/mocks/users?qty=-5"

La API debe rechazar la cantidad negativa y devolver el código de error:

NEGATIVE_MOCK_QUANTITY

Cantidad igual a cero

curl "http://localhost:8080/api/mocks/users?qty=0"

La API responde con HTTP 400 y el código:

INVALID_MOCK_QUANTITY

Mensaje esperado:

La cantidad de mocks debe ser un número entero mayor que cero.

ID de pedido inválido

curl "http://localhost:8080/api/orders/id-invalido"

La respuesta debe utilizar:

INVALID_ORDER_ID

y no producir un error interno de Mongoose.

ID de usuario inválido

curl "http://localhost:8080/api/users/id-invalido"

La respuesta debe utilizar:

INVALID_USER_ID

ID de usuario inválido al crear un pedido

Ejemplo conceptual de body:

{
  "user": "id-invalido",
  "total": 2500,
  "priority": "HIGH"
}

La lógica de creación valida el identificador antes de consultar el
usuario y utiliza:

INVALID_USER_ID

Uploads

Configuración:

src/config/multer.config.js

Versión:

multer@2.2.0

Destinos:

uploads/users/
uploads/receipts/

MIME permitidos:

application/pdf
image/jpeg
image/png

Límite:

5 MB

Los nombres de archivos se generan de forma única.

Pruebas manuales de errores de Multer

Archivo faltante

Enviar la solicitud sin el campo file permite comprobar el manejo de:

FILE_REQUIRED

MIME no permitido

Intentar subir un tipo de archivo distinto de PDF, JPEG o PNG permite
comprobar:

INVALID_FILE_TYPE

Archivo mayor a 5 MB

Utilizar un PDF, JPEG o PNG superior a 5 MB.

Ejemplo:

curl -X POST "http://localhost:8080/api/users/USER_ID/documents" \
  -F "file=@archivo-grande.pdf" \
  -F "documentType=DNI"

Multer debe rechazar el archivo al superar el límite configurado y el
middleware global debe procesar el error.

Campo multipart incorrecto

La ruta espera el archivo en:

file

Para provocar un campo inesperado:

curl -X POST "http://localhost:8080/api/users/USER_ID/documents" \
  -F "document=@documento.pdf" \
  -F "documentType=DNI"

Al utilizar document en lugar de file, Multer genera el error de
campo inesperado y el middleware global lo procesa.

Tipo de documento inválido

Puede enviarse un archivo permitido acompañado por un documentType
distinto de:

DNI
LICENSE
OTHER

La operación debe rechazarse mediante:

INVALID_DOCUMENT_TYPE

Usuario inexistente o ID inválido

Las validaciones de carga contemplan usuarios inexistentes e IDs
inválidos. Cuando una operación falla después de crear un archivo, el
servicio elimina el archivo cuando corresponde para evitar archivos
huérfanos.

Swagger / OpenAPI

Disponible en:

http://localhost:8080/api/docs

Endpoint:

GET /api/docs

Incluye:

Endpoints

Parámetros

Modelos

Respuestas

Schemas reutilizables

Documentación de errores

Endpoints multipart/form-data

Carga de documentos

Carga de comprobantes

Pruebas desde navegador

Archivo:

src/docs/swagger.js

La documentación reutiliza las constantes centralizadas cuando
corresponde.

Tests

Los tests utilizan:

Mocha

Chai

Supertest

MongoDB

cross-env

Ejecutar:

npm test

Script:

"test": "cross-env NODE_ENV=test mocha test/setup.js test/**/*.test.js --exit"

cross-env está declarado como dependencia de desarrollo, por lo que
después de ejecutar npm install no es necesario instalarlo globalmente
ni modificar el script para utilizar una instalación global.

Resultado actual

En la última ejecución completa de la suite:

45 passing

La suite incluye pruebas funcionales automatizadas para documentos de
usuarios y comprobantes de pedidos.

Cobertura funcional actual

Health Check

Respuesta correcta de /health.

Logger

Ejecución de /api/logger.

Niveles de logging.

Mocks

Usuarios mock.

Drivers mock.

Datos relacionados.

Cantidades inválidas.

Orders

Listado.

Lista vacía.

Creación.

Datos obligatorios.

Usuario inexistente.

ID de usuario inválido.

Búsqueda por ID.

Pedido inexistente.

ID de pedido inválido.

Actualización de estado.

Estado inválido.

Pedido inexistente al actualizar.

ID inválido al actualizar.

Products

Listado.

Producto inexistente.

Swagger

Existencia de /api/docs.

Users

Listado.

Lista vacía.

Creación.

Datos obligatorios.

Nombre faltante.

Email faltante.

Email duplicado.

Uploads de documentos

PDF válido.

PNG válido.

Archivo faltante.

MIME inválido.

Archivo mayor a 5 MB.

Usuario inexistente.

ID de usuario inválido.

Tipo de documento inválido.

Campo de archivo incorrecto.

Uploads de comprobantes

PDF válido.

Archivo faltante.

MIME inválido.

Archivo mayor a 5 MB.

Pedido inexistente.

ID de pedido inválido.

Campo de archivo incorrecto.

Comandos

Desarrollo:

npm run dev

Producción:

npm start

Tests:

npm test

package.json

Multer se encuentra fijado a:

2.2.0

Después de instalar las dependencias se puede comprobar con:

npm list multer

Resultado esperado:

shipnow-backend@1.0.0
└── multer@2.2.0

La diferencia entre el nombre descriptivo del paquete shipnow-backend
y el nombre técnico del repositorio backend-main no afecta el
funcionamiento de la aplicación.

Estado actual del proyecto

Arquitectura

✅ Arquitectura por capas

✅ Routes

✅ Controllers

✅ Services

✅ Repositories

✅ Models

✅ Middleware global de errores

✅ Constantes centralizadas

✅ Separación Service / Repository documentada

API

✅ Health Check

✅ Users API

✅ Products API

✅ Orders API

✅ Mock API

✅ Logger API

✅ Swagger/OpenAPI

Base de datos

✅ MongoDB Atlas / MongoDB mediante Mongoose

✅ Repositories

✅ Validación de IDs

✅ Configuración separada para testing

Archivos

✅ Upload de documentos

✅ Upload de comprobantes

✅ Validación MIME

✅ Límite de 5 MB

✅ Manejo de errores de Multer

✅ Limpieza de archivos cuando una carga es rechazada

✅ Multer 2.2.0

✅ Cobertura automatizada específica de documentos y comprobantes

Errores

✅ AppError

✅ Diccionario centralizado

✅ Middleware global

✅ Respuestas HTTP consistentes

✅ Validación de IDs inválidos

✅ Manejo de errores de archivos

Logging

✅ Winston

✅ Rotación diaria

✅ Logger API

✅ debug/http/info/warning/error/fatal

Documentación

✅ Swagger/OpenAPI

✅ README actualizado

✅ Justificación Service / Repository

✅ Ejemplos manuales de errores

✅ Pruebas manuales de errores de Multer

✅ Requisitos del entorno de testing documentados

Testing

✅ Mocha

✅ Chai

✅ Supertest

✅ Tests de API

✅ Tests de validaciones

✅ Tests de errores

✅ Tests de documentos

✅ Tests de comprobantes

✅ Tests de IDs inválidos

✅ Última ejecución conocida: 45 pruebas aprobadas

Mejoras opcionales

Algunas observaciones del proceso fueron recomendaciones de mejora y no
bloquean el funcionamiento actual.

Entre ellas:

ampliar casos de prueba del endpoint de seed ante fallas de
conexión;

considerar mongodb-memory-server para aislar completamente los
tests de una base externa;

ampliar tests de actualización/eliminación si se incorporan o
exponen nuevos endpoints.

Actualmente la necesidad de una instancia MongoDB para testing queda
documentada de forma explícita.

Verificación final antes del commit

Instalar dependencias:

npm install

Comprobar Multer:

npm list multer

Ejecutar tests:

npm test

Revisar cambios:

git status
git diff --stat
git diff

Verificar que no se incluyan:

.env
.env.test
node_modules/
uploads/
logs/

La cobertura automatizada de documentos y comprobantes ya fue
comprobada. Antes del commit final se recomienda volver a ejecutar toda
la suite y revisar el estado y las diferencias de Git.

Repositorio

https://github.com/AgustinMolini-hub/backend-main

ShipNow Backend --- API REST organizada por capas, con MongoDB,
manejo centralizado de errores, uploads, logging, mocks, Swagger y tests
automatizados.