import { OrderService } from '../services/order.service.js';

const orderService = new OrderService();

export class OrderController {
    static async getAll(req, res, next) {
        try {
            const orders = await orderService.getAllOrders();

            return res.status(200).json({
                status: 'success',
                payload: orders
            });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const { id } = req.params;

            const order = await orderService.getOrderById(id);

            return res.status(200).json({
                status: 'success',
                payload: order
            });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const order = await orderService.createOrder(req.body);

            return res.status(201).json({
                status: 'success',
                payload: order
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await orderService.updateStatus(
                id,
                status
            );

            return res.status(200).json({
                status: 'success',
                payload: order
            });
        } catch (error) {
            next(error);
        }
    }
}
