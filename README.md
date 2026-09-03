# ShipNow Backend

Backend REST API para **ShipNow**, desarrollado con Node.js, Express, MongoDB y Mongoose.

El proyecto implementa una arquitectura por capas, manejo centralizado de errores, logging, carga de archivos, documentación Swagger/OpenAPI, tests automatizados, configuración por ambiente, optimizaciones básicas de performance y ejecución mediante Docker.

---

## Arquitectura

La aplicación utiliza la siguiente separación por capas:

```text
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
```

Responsabilidades principales:

- **Routes:** definición de endpoints HTTP y middlewares asociados.
- **Controllers:** manejo de requests y responses.
- **Services:** lógica de negocio y validaciones.
- **Repositories:** acceso y operaciones sobre MongoDB mediante Mongoose.
- **Models:** esquemas y modelos de Mongoose.
- **Middlewares:** procesamiento transversal, manejo de errores y uploads.
- **Constants:** valores reutilizables y estados del dominio.
- **Errors:** errores de aplicación y respuestas centralizadas.
- **Config:** configuración de entorno, base de datos, logger y Multer.

### Separación Service / Repository

La separación entre **Service** y **Repository** mantiene las reglas de negocio desacopladas de la persistencia.

El Service se encarga de:

- validar datos;
- comprobar recursos;
- aplicar reglas de negocio;
- coordinar operaciones.

El Repository se encarga de:

- consultar MongoDB;
- crear registros;
- actualizar registros;
- encapsular el acceso a Mongoose.

Esta separación reduce el acoplamiento, evita colocar lógica de persistencia en controllers y facilita el mantenimiento y las pruebas.

---

## Tecnologías

- Node.js
- Express
- MongoDB
- MongoDB Atlas
- Mongoose
- dotenv
- Swagger / OpenAPI
- Winston
- winston-daily-rotate-file
- Multer 2.2.0
- Mocha
- Chai
- Supertest
- cross-env
- Docker
- ES Modules

---

## Funcionalidades

El backend incluye:

- API REST.
- Arquitectura por capas.
- Persistencia con MongoDB y Mongoose.
- Manejo centralizado de errores.
- Validaciones de negocio.
- Validación de ObjectId.
- Logging con Winston.
- Rotación diaria de logs.
- Nivel de logging configurable por ambiente.
- Upload de documentos y comprobantes con Multer.
- Restricción de tipos MIME.
- Límite de tamaño de archivos.
- Limpieza de archivos cuando una operación de upload es rechazada.
- Datos mock y seed para desarrollo/testing.
- Swagger/OpenAPI.
- Tests automatizados.
- Configuración diferenciada por ambiente.
- Validación de variables de entorno al iniciar.
- Health check.
- Paginación y límites para listados.
- Dockerfile y `.dockerignore`.
- Restricción de endpoints internos en producción.

---

## Estructura principal

```text
src/
├── config/
│   ├── database.js
│   ├── env.config.js
│   ├── logger.js
│   └── multer.config.js
├── constants/
│   └── index.js
├── controllers/
│   ├── logger.controller.js
│   ├── mock.controller.js
│   ├── order.controller.js
│   ├── product.controller.js
│   └── user.controller.js
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
│   ├── logger.routes.js
│   ├── mock.routes.js
│   ├── order.routes.js
│   ├── product.routes.js
│   └── user.routes.js
├── services/
├── app.js
└── server.js

test/
uploads/
logs/

Dockerfile
.dockerignore
.env.example
package.json
README.md
```

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/AgustinMolini-hub/backend-main.git
cd backend-main
```

Instalar dependencias:

```bash
npm install
```

---

# Variables de entorno

La configuración se centraliza en:

```text
src/config/env.config.js
```

El proyecto utiliza las siguientes variables:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto HTTP de la aplicación |
| `MONGODB_URI` | URI de conexión a MongoDB |
| `NODE_ENV` | Ambiente de ejecución |
| `LOG_LEVEL` | Nivel mínimo de logging |

Los ambientes permitidos son:

```text
development
test
production
```

Los niveles de log permitidos son:

```text
fatal
error
warning
info
http
debug
```

El proyecto incluye `.env.example` como referencia:

```env
PORT=8080
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/shipnow_db
NODE_ENV=development
LOG_LEVEL=debug
```

No deben subirse credenciales reales al repositorio.

---

## Desarrollo

Crear un archivo `.env`:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_db
NODE_ENV=development
LOG_LEVEL=debug
```

Ejecutar:

```bash
npm run dev
```

---

## Testing

Crear `.env.test`:

```env
PORT=8081
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow_test
NODE_ENV=test
LOG_LEVEL=debug
```

La configuración de testing permite utilizar una base de datos separada de la utilizada durante desarrollo.

Los tests requieren una instancia de MongoDB accesible mediante `MONGODB_URI`.

Ejecutar:

```bash
npm test
```

---

## Producción

En producción deben suministrarse las variables de entorno desde el entorno de ejecución o desde un archivo externo que no forme parte de la imagen ni del repositorio.

Ejemplo conceptual:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/shipnow
NODE_ENV=production
LOG_LEVEL=info
```

La aplicación valida las variables críticas durante el inicio.

Si falta alguna de las siguientes variables:

```text
PORT
MONGODB_URI
NODE_ENV
LOG_LEVEL
```

la aplicación no continúa normalmente con una configuración incompleta y muestra un error indicando las variables faltantes.

También se valida:

- rango válido de `PORT`;
- valor permitido de `NODE_ENV`;
- valor permitido de `LOG_LEVEL`.

El proyecto actualmente no utiliza JWT ni servicios externos adicionales, por lo que no requiere variables de configuración para esas funcionalidades.

---

# Archivos que no se versionan

El repositorio excluye, entre otros:

```text
.env
.env.test
node_modules/
uploads/
logs/
test-files/
```

Las credenciales y archivos generados durante la ejecución no deben incorporarse al control de versiones.

---

# API

URL local por defecto:

```text
http://localhost:8080
```

---

## Health Check

Endpoint:

```http
GET /health
```

Ejemplo:

```json
{
  "status": "ok",
  "environment": "production",
  "uptime": 11.7423915,
  "timestamp": "2026-09-03T03:19:13.047Z"
}
```

El health check informa:

- estado de la API;
- ambiente;
- uptime del proceso;
- timestamp.

No expone credenciales ni información sensible.

---

# Performance y escalabilidad

Los endpoints de listado principales utilizan paginación para evitar devolver colecciones completas sin límite.

La configuración utilizada es:

```text
page por defecto: 1
limit por defecto: 10
limit máximo: 100
```

Formato general:

```json
{
  "status": "success",
  "payload": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Esto se aplica actualmente a:

```http
GET /api/users
GET /api/orders
GET /api/products
```

Ejemplos:

```http
GET /api/users?page=1&limit=10
GET /api/orders?page=2&limit=10
GET /api/products?page=1&limit=20
```

Si se solicita un `limit` superior a `100`, la aplicación utiliza como máximo `100`.

Los repositories utilizan `skip`, `limit` y `countDocuments` para obtener la página solicitada y su metadata.

Actualmente no existe un endpoint general de listado de deliveries dentro de la API principal, por lo que no se expone una consulta sin límite de esa colección.

---

# Users API

Base:

```text
/api/users
```

Endpoints principales:

```http
GET  /api/users
POST /api/users
GET  /api/users/:id
POST /api/users/:id/documents
```

## Listado paginado

```http
GET /api/users?page=1&limit=10
```

## Crear usuario

```http
POST /api/users
Content-Type: application/json
```

Ejemplo:

```json
{
  "name": "Usuario Test",
  "email": "usuario.test@test.com"
}
```

---

# Products API

Base:

```text
/api/products
```

Endpoints principales:

```http
GET   /api/products
POST  /api/products
GET   /api/products/:id
PATCH /api/products/:id
```

## Listado paginado

```http
GET /api/products?page=1&limit=10
```

También puede filtrarse por disponibilidad:

```http
GET /api/products?available=true&page=1&limit=10
```

El filtro se combina con la paginación y la metadata refleja la cantidad de documentos que cumplen el criterio.

Estados utilizados:

```text
AVAILABLE
OUT_OF_STOCK
DISCONTINUED
```

---

# Orders API

Base:

```text
/api/orders
```

Endpoints principales:

```http
GET   /api/orders
POST  /api/orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
POST  /api/orders/:id/receipt
```

## Listado paginado

```http
GET /api/orders?page=1&limit=10
```

## Crear pedido

```http
POST /api/orders
Content-Type: application/json
```

Ejemplo:

```json
{
  "user": "ID_DEL_USUARIO",
  "total": 2500,
  "priority": "HIGH"
}
```

Se validan:

- datos obligatorios;
- formato del ID del usuario;
- existencia del usuario;
- tipo y valor de `total`;
- prioridad.

Estados:

```text
PENDING
CONFIRMED
IN_TRANSIT
DELIVERED
CANCELLED
```

Prioridades:

```text
LOW
MEDIUM
HIGH
```

## Actualizar estado

```http
PATCH /api/orders/:id/status
```

Ejemplo:

```json
{
  "status": "CONFIRMED"
}
```

---

# Uploads

La configuración de archivos está centralizada en:

```text
src/config/multer.config.js
```

Se utiliza:

```text
multer@2.2.0
```

Tipos MIME permitidos:

```text
application/pdf
image/jpeg
image/png
```

Tamaño máximo:

```text
5 MB
```

Los nombres se generan de forma única y se conserva la extensión del archivo.

Los directorios necesarios se crean utilizando operaciones asíncronas del módulo `fs/promises`, evitando operaciones síncronas innecesarias durante la inicialización.

---

## Documentos de usuarios

Endpoint:

```http
POST /api/users/:id/documents
```

Campo multipart:

```text
file
```

También requiere:

```text
documentType
```

Tipos permitidos:

```text
DNI
LICENSE
OTHER
```

Estos valores se encuentran centralizados mediante `DOCUMENT_TYPES` en:

```text
src/constants/index.js
```

Destino local:

```text
uploads/users/
```

---

## Comprobantes de pedidos

Endpoint:

```http
POST /api/orders/:id/receipt
```

Campo multipart:

```text
file
```

Destino local:

```text
uploads/receipts/
```

---

## Manejo de errores de uploads

Se controlan casos como:

- archivo faltante;
- tipo MIME no permitido;
- archivo mayor a 5 MB;
- campo multipart incorrecto;
- tipo de documento inválido;
- usuario inexistente;
- pedido inexistente;
- IDs inválidos.

Cuando una operación falla después de que el archivo fue creado, el servicio elimina el archivo cuando corresponde para evitar archivos huérfanos.

---

## Política de almacenamiento

El directorio:

```text
uploads/
```

está excluido del repositorio mediante `.gitignore` y de la imagen mediante `.dockerignore`.

El almacenamiento local implementado en este proyecto está destinado al entorno de desarrollo, testing y demostración de la funcionalidad.

No debe considerarse almacenamiento durable para una infraestructura productiva escalable.

En una implementación productiva real se debería utilizar una solución persistente, por ejemplo:

- almacenamiento de objetos externo;
- volumen persistente administrado por la infraestructura.

Los metadatos asociados a los archivos permanecen registrados en MongoDB según la lógica de la aplicación.

---

# Logging

El logging utiliza:

```text
Winston
winston-daily-rotate-file
```

Archivo de configuración:

```text
src/config/logger.js
```

Niveles:

```text
fatal
error
warning
info
http
debug
```

El nivel utilizado se configura mediante:

```text
LOG_LEVEL
```

Ejemplo para desarrollo:

```env
LOG_LEVEL=debug
```

Ejemplo para producción:

```env
LOG_LEVEL=info
```

Los archivos de log utilizan rotación diaria.

El directorio:

```text
logs/
```

no se versiona.

En una infraestructura productiva, los logs deberían ser recolectados por la plataforma o almacenados en un destino persistente apropiado.

---

# Manejo centralizado de errores

Archivos principales:

```text
src/errors/app.error.js
src/errors/error.dictionary.js
src/middlewares/error.middleware.js
```

Formato general:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje",
    "details": {}
  }
}
```

Entre los errores controlados se encuentran:

```text
INVALID_USER_DATA
USER_ALREADY_EXISTS
INVALID_USER_ID
USER_NOT_FOUND

INVALID_ORDER_DATA
INVALID_ORDER_ID
ORDER_NOT_FOUND
INVALID_ORDER_STATUS

INVALID_PRODUCT_DATA
INVALID_PRODUCT_PRICE
PRODUCT_NOT_FOUND

FILE_REQUIRED
INVALID_FILE_TYPE
INVALID_DOCUMENT_TYPE
INVALID_UPLOAD_TYPE
FILE_SAVE_ERROR

NEGATIVE_MOCK_QUANTITY
```

También se procesan errores generados por Multer, incluyendo archivos demasiado grandes y campos multipart inesperados.

---

# Validación de IDs

Los ObjectId se validan antes de consultar MongoDB cuando corresponde.

Ejemplo conceptual:

```js
if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('INVALID_ORDER_ID', {
        orderId: id
    });
}
```

Esto evita que IDs con formato inválido provoquen errores de casting no controlados de Mongoose.

---

# Mocks y Logger

Durante desarrollo y testing están disponibles endpoints auxiliares para mocks y prueba del logger.

Mocks:

```text
/api/mocks
```

Logger:

```http
GET /api/logger
```

Estos endpoints están registrados únicamente cuando:

```text
NODE_ENV !== production
```

Por lo tanto, no quedan expuestos en producción.

La configuración fue verificada ejecutando la aplicación mediante Docker con:

```text
NODE_ENV=production
```

y comprobando que:

```http
GET /api/mocks/users
GET /api/logger
```

respondieran con HTTP `404`.

---

# Swagger / OpenAPI

Swagger está disponible en:

```text
http://localhost:8080/api/docs/
```

El endpoint:

```http
GET /api/docs
```

devuelve una referencia a la interfaz:

```json
{
  "status": "success",
  "message": "Swagger UI disponible",
  "docs": "/api/docs/"
}
```

La documentación incluye:

- endpoints;
- parámetros;
- paginación;
- filtros;
- modelos;
- respuestas;
- schemas;
- errores;
- endpoints `multipart/form-data`;
- uploads de documentos;
- uploads de comprobantes.

Swagger permanece disponible en producción como criterio de documentación y verificación de la API.

Los endpoints internos de mocks y logger sí quedan restringidos.

---

# Tests

La suite utiliza:

- Mocha
- Chai
- Supertest
- MongoDB
- cross-env

Ejecutar:

```bash
npm test
```

Script:

```json
"test": "cross-env NODE_ENV=test mocha test/setup.js test/**/*.test.js --exit"
```

`cross-env` se encuentra declarado como dependencia de desarrollo, por lo que no necesita una instalación global.

## Resultado actual

Última ejecución completa:

```text
52 passing (9s)
```

La suite incluye pruebas para:

- Health Check.
- Logger.
- Mocks.
- Users.
- Orders.
- Products.
- Swagger.
- Validaciones.
- IDs inválidos.
- Errores controlados.
- Upload de documentos.
- Upload de comprobantes.
- MIME inválido.
- Archivos mayores a 5 MB.
- Campos multipart incorrectos.
- Paginación de Users.
- Paginación de Orders.
- Paginación de Products.
- Límite máximo de 100 registros por página.
- Filtro `available` combinado con paginación.

Los tests utilizan una instancia de MongoDB configurada mediante `.env.test`.

---

# Docker

El proyecto incluye:

```text
Dockerfile
.dockerignore
```

## Dockerfile

La imagen utiliza:

```text
node:22-alpine
```

El proceso:

1. define `/app` como directorio de trabajo;
2. copia `package.json` y `package-lock.json`;
3. instala únicamente dependencias de producción con `npm ci --omit=dev`;
4. copia el código fuente;
5. crea los directorios necesarios para uploads y logs;
6. asigna permisos al usuario no privilegiado `node`;
7. expone el puerto `8080`;
8. inicia la aplicación mediante `npm start`.

Las variables de entorno no se incorporan dentro de la imagen.

---

## `.dockerignore`

Se excluyen del contexto de construcción, entre otros:

```text
node_modules
.env
.env.*
.git
logs
uploads
coverage
.nyc_output
tmp
temp
test-files
.vscode
.idea
```

`.env.example` se mantiene disponible como referencia.

---

## Construir la imagen

Desde la raíz del proyecto:

```bash
docker build -t shipnow-backend .
```

La construcción fue verificada correctamente utilizando Docker Desktop con backend Linux/WSL2.

---

## Ejecutar en desarrollo

Con un `.env` local:

```bash
docker run --rm \
  --name shipnow-api \
  -p 8080:8080 \
  --env-file .env \
  shipnow-backend
```

En PowerShell también puede ejecutarse en una sola línea:

```powershell
docker run --rm --name shipnow-api -p 8080:8080 --env-file .env shipnow-backend
```

La aplicación queda disponible en:

```text
http://localhost:8080
```

---

## Ejecutar en producción

Las variables deben suministrarse externamente.

Por ejemplo, utilizando un archivo `.env.production` que permanezca fuera del repositorio:

```powershell
docker run --rm --name shipnow-api-prod -p 8080:8080 --env-file .env.production shipnow-backend
```

Para una verificación local también pueden sobrescribirse variables específicas:

```powershell
docker run --rm --name shipnow-api-prod -p 8080:8080 --env-file .env -e NODE_ENV=production -e LOG_LEVEL=info shipnow-backend
```

La imagen no contiene las credenciales del archivo `.env`.

---

## Verificar el contenedor

Health:

```powershell
irm "http://localhost:8080/health"
```

Productos paginados:

```powershell
irm "http://localhost:8080/api/products?page=1&limit=2"
```

Swagger:

```powershell
irm "http://localhost:8080/api/docs"
```

En producción, comprobar que los endpoints internos no estén expuestos:

```powershell
curl.exe -i http://localhost:8080/api/mocks/users
curl.exe -i http://localhost:8080/api/logger
```

Ambos deben responder HTTP `404`.

---

# Verificación realizada con Docker

La imagen:

```text
shipnow-backend:latest
```

fue construida correctamente.

Se verificó en modo development:

```http
GET /health
GET /api/products?page=1&limit=2
GET /api/docs
```

Resultados:

- Health respondió correctamente.
- Products devolvió metadata de paginación.
- Swagger estuvo disponible.

También se verificó en modo production:

```http
GET /health
GET /api/docs
GET /api/products?page=1&limit=2
GET /api/mocks/users
GET /api/logger
```

Resultados:

- `/health` informó `environment: production`.
- Swagger permaneció disponible.
- Products funcionó con paginación.
- `/api/mocks/users` respondió `404`.
- `/api/logger` respondió `404`.

---

# Comandos principales

Desarrollo:

```bash
npm run dev
```

Producción:

```bash
npm start
```

Tests:

```bash
npm test
```

Construir Docker:

```bash
docker build -t shipnow-backend .
```

Ejecutar Docker:

```bash
docker run --rm --name shipnow-api -p 8080:8080 --env-file .env shipnow-backend
```

---

# Verificación antes de un commit

Ejecutar la suite:

```powershell
npm test
```

Comprobar formato del diff:

```powershell
git diff --check
```

Revisar archivos modificados:

```powershell
git status --short
```

Verificar que los archivos de entorno no estén versionados:

```powershell
git ls-files .env .env.test
```

Ese último comando no debería mostrar resultados.

También conviene comprobar:

```powershell
git diff --stat
```

Antes del commit deben permanecer fuera del repositorio:

```text
.env
.env.test
node_modules/
uploads/
logs/
```

---

# Estado actual

El proyecto cuenta con:

- Arquitectura por capas.
- Separación Service / Repository.
- MongoDB y Mongoose.
- Variables de entorno validadas.
- Configuración para development, test y production.
- Health check con ambiente, uptime y timestamp.
- Manejo centralizado de errores.
- Validación de ObjectId.
- Constantes centralizadas.
- Users API.
- Products API.
- Orders API.
- Paginación con límite máximo.
- Filtros en Products.
- Upload de documentos.
- Upload de comprobantes.
- Multer 2.2.0.
- Límite de uploads de 5 MB.
- Restricción MIME.
- Limpieza de archivos rechazados.
- Logging configurable.
- Rotación diaria de logs.
- Swagger/OpenAPI.
- Endpoints internos restringidos en producción.
- Dockerfile.
- `.dockerignore`.
- Imagen Docker verificada.
- Tests automatizados.
- **52 pruebas aprobadas en la última ejecución completa.**

---

# Repositorio

```text
https://github.com/AgustinMolini-hub/backend-main
```

ShipNow Backend — API REST organizada por capas y preparada para ejecución local y mediante Docker, con configuración por ambiente, controles de performance, uploads, logging, documentación y tests automatizados.