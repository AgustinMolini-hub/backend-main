import { OrderRepository } from '../repositories/order.repository.js';
import { UserRepository } from '../repositories/user.repository.js';
import {
    ORDER_STATUS,
    ORDER_PRIORITY
} from '../constants/index.js';
import { AppError } from '../errors/app.error.js';
import logger from '../config/logger.js';

export class OrderService {
    constructor() {
        this.orderRepo = new OrderRepository();
        this.userRepo = new UserRepository();
    }

    async getAllOrders() {
        return await this.orderRepo.getAll();
    }

    async getOrderById(id) {
        const order = await this.orderRepo.getById(id);

        if (!order) {
            throw new AppError('ORDER_NOT_FOUND');
        }

        return order;
    }

    async createOrder(data) {
        if (!data.user || data.total === undefined) {
            throw new AppError('INVALID_ORDER_DATA');
        }

        const user = await this.userRepo.getById(data.user);

        if (!user) {
            throw new AppError('USER_NOT_FOUND');
        }

        if (
            typeof data.total !== 'number' ||
            Number.isNaN(data.total) ||
            data.total < 0
        ) {
            throw new AppError('INVALID_ORDER_DATA');
        }

        const priority = Object.values(ORDER_PRIORITY).includes(
            data.priority
        )
            ? data.priority
            : ORDER_PRIORITY.MEDIUM;

        return await this.orderRepo.create({
            user: data.user,
            total: data.total,
            priority,
            status: ORDER_STATUS.PENDING
        });
    }

    async updateStatus(id, status) {
        const order = await this.orderRepo.getById(id);

        if (!order) {
            throw new AppError('ORDER_NOT_FOUND');
        }

        if (!Object.values(ORDER_STATUS).includes(status)) {
            throw new AppError('INVALID_ORDER_STATUS');
        }

        return await this.orderRepo.updateStatus(id, status);
    }

    async uploadReceipt(id, file) {
        const order = await this.orderRepo.getById(id);

        if (!order) {
            throw new AppError('ORDER_NOT_FOUND', {
                orderId: id
            });
        }

        if (!file) {
            throw new AppError('FILE_REQUIRED');
        }

        const receiptData = {
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date()
        };

        const updatedOrder = await this.orderRepo.addReceipt(
            id,
            receiptData
        );

        logger.info(
            `Comprobante subido correctamente para pedido ${id}: ${file.originalname}`
        );

        return updatedOrder;
    }
}