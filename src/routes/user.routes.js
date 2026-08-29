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
 *     summary: Obtener todos los usuarios
 *     description: Devuelve la lista de usuarios registrados.
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', UserController.getAll);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Crear un usuario
 *     description: Registra un nuevo usuario en MongoDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Usuario Prueba
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario.prueba@test.com
 *               role:
 *                 type: string
 *                 enum:
 *                   - ADMIN
 *                   - USER
 *                   - DRIVER
 *                 example: USER
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: El email ya está registrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', UserController.create);

/**
 * @swagger
 * /api/users/{id}/documents:
 *   post:
 *     tags:
 *       - Users
 *     summary: Subir documento de usuario
 *     description: Recibe un documento mediante multipart/form-data y lo asocia al usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - documentType
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Documento PDF, JPG, JPEG o PNG. Máximo 5 MB.
 *               documentType:
 *                 type: string
 *                 enum:
 *                   - DNI
 *                   - LICENSE
 *                   - OTHER
 *                 example: DNI
 *     responses:
 *       200:
 *         description: Documento cargado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Archivo faltante, tipo de archivo inválido, archivo demasiado grande o tipo de documento inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno al guardar el archivo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/:id/documents',
    setUploadType('user-document'),
    upload.single('file'),
    UserController.uploadDocument
);

export default router;