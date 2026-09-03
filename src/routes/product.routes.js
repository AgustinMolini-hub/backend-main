import { Router } from 'express';

import { ProductController } from '../controllers/product.controller.js';


const router = Router();


/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener productos
 *     description: Devuelve los productos registrados utilizando paginación y permite filtrar por disponibilidad.
 *     parameters:
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrar solo productos disponibles.
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
 *         description: Cantidad de productos por página. Máximo 100.
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
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
    ProductController.getAll
);


/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Crear producto
 *     description: Registra un nuevo producto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mouse Gamer
 *               price:
 *                 type: number
 *                 example: 35000
 *               stock:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 */
router.post(
    '/',
    ProductController.create
);


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado.
 *       404:
 *         description: Producto no encontrado.
 */
router.get(
    '/:id',
    ProductController.getById
);


/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     tags:
 *       - Products
 *     summary: Actualizar producto
 *     description: Actualiza precio, stock u otros campos del producto.
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mouse Gamer RGB
 *               price:
 *                 type: number
 *                 example: 40000
 *               stock:
 *                 type: number
 *                 example: 15
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Producto no encontrado.
 */
router.patch(
    '/:id',
    ProductController.update
);


export default router;