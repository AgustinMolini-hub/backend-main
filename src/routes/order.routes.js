import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import upload from '../config/multer.config.js';
import { setUploadType } from '../middlewares/upload-type.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Obtener todos los pedidos
 *     responses:
 *       200:
 *         description: Pedidos obtenidos correctamente.
 */
router.get('/', OrderController.getAll);


/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Crear un pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - total
 *             properties:
 *               user:
 *                 type: string
 *               total:
 *                 type: number
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *     responses:
 *       201:
 *         description: Pedido creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Usuario no encontrado.
 */
router.post('/', OrderController.create);


/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Obtener un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido obtenido correctamente.
 *       404:
 *         description: Pedido no encontrado.
 */
router.get('/:id', OrderController.getById);


/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Actualizar el estado de un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - CONFIRMED
 *                   - IN_TRANSIT
 *                   - DELIVERED
 *                   - CANCELLED
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente.
 *       400:
 *         description: Estado inválido.
 *       404:
 *         description: Pedido no encontrado.
 */
router.patch('/:id/status', OrderController.updateStatus);


/**
 * @swagger
 * /api/orders/{id}/receipt:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Subir comprobante de un pedido
 *     description: Recibe un archivo multipart/form-data y guarda sus metadatos asociados al pedido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo del comprobante
 *     responses:
 *       200:
 *         description: Comprobante cargado correctamente.
 *       400:
 *         description: Archivo faltante o inválido.
 *       404:
 *         description: Pedido no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
    '/:id/receipt',
    setUploadType('receipt'),
    upload.single('file'),
    OrderController.uploadReceipt
);


export default router;