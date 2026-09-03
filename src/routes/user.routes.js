import { Router } from 'express';

import { UserController } from '../controllers/user.controller.js';

import upload from '../config/multer.config.js';

import { setUploadType } from '../middlewares/upload-type.middleware.js';


const router = Router();


/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener usuarios
 *     description: Devuelve los usuarios registrados utilizando paginación.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de usuarios por página. Máximo 100.
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload: []
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 0
 *                 totalPages: 0
 */
router.get(
    '/',
    UserController.getAll
);


/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Crear un usuario
 *     description: Registra un nuevo usuario en MongoDB.
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *       400:
 *         description: Datos inválidos.
 */
router.post(
    '/',
    UserController.create
);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener usuario por ID
 *     description: Busca un usuario específico mediante su ObjectId de MongoDB.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a91c0b30e52f1b96d27114c
 *
 *     responses:
 *
 *       200:
 *         description: Usuario encontrado correctamente.
 *
 *       400:
 *         description: ID inválido.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               error:
 *                 code: INVALID_USER_ID
 *                 message: El ID del usuario no tiene un formato válido.
 *
 *       404:
 *         description: Usuario no encontrado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
    '/:id',
    UserController.getById
);


/**
 * @swagger
 * /api/users/{id}/documents:
 *   post:
 *     tags:
 *       - Users
 *     summary: Subir documento de usuario
 *     description: Guarda un documento asociado al usuario.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - documentType
 *
 *             properties:
 *
 *               file:
 *                 type: string
 *                 format: binary
 *
 *               documentType:
 *                 type: string
 *                 enum:
 *                   - DNI
 *                   - LICENSE
 *                   - OTHER
 *
 *     responses:
 *
 *       200:
 *         description: Documento cargado correctamente.
 *
 *       400:
 *         description: Archivo inválido o datos incorrectos.
 *
 *       404:
 *         description: Usuario no encontrado.
 */
router.post(
    '/:id/documents',
    setUploadType('user-document'),
    upload.single('file'),
    UserController.uploadDocument
);


export default router;