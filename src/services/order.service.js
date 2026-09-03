import mongoose from 'mongoose';
import fs from 'fs/promises';

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


    async getAllOrders(page = 1, limit = 10) {

        const parsedPage = Number.parseInt(page, 10);
        const parsedLimit = Number.parseInt(limit, 10);

        const validPage =
            Number.isInteger(parsedPage) && parsedPage > 0
                ? parsedPage
                : 1;

        const validLimit =
            Number.isInteger(parsedLimit) && parsedLimit > 0
                ? Math.min(parsedLimit, 100)
                : 10;


        return await this.orderRepo.getAll(
            validPage,
            validLimit
        );

    }


    async getOrderById(id) {


        if (!mongoose.Types.ObjectId.isValid(id)) {


            throw new AppError(
                'INVALID_ORDER_ID',
                {
                    orderId: id
                }
            );

        }


        const order =
            await this.orderRepo.getById(id);


        if (!order) {


            throw new AppError(
                'ORDER_NOT_FOUND',
                {
                    orderId: id
                }
            );

        }


        return order;

    }


    async createOrder(data) {


        if (
            !data.user ||
            data.total === undefined
        ) {


            throw new AppError(
                'INVALID_ORDER_DATA'
            );

        }


        if (!mongoose.Types.ObjectId.isValid(data.user)) {


            throw new AppError(
                'INVALID_USER_ID',
                {
                    userId: data.user
                }
            );

        }


        const user =
            await this.userRepo.getById(
                data.user
            );


        if (!user) {


            throw new AppError(
                'USER_NOT_FOUND',
                {
                    userId: data.user
                }
            );

        }


        if (
            typeof data.total !== 'number' ||
            Number.isNaN(data.total) ||
            data.total < 0
        ) {


            throw new AppError(
                'INVALID_ORDER_DATA'
            );

        }


        const priority =

            Object.values(
                ORDER_PRIORITY
            ).includes(data.priority)

                ?

                data.priority

                :

                ORDER_PRIORITY.MEDIUM;


        const order =

            await this.orderRepo.create({

                user: data.user,

                total: data.total,

                priority,

                status: ORDER_STATUS.PENDING

            });


        logger.info(
            `Pedido creado correctamente: ${order._id}`
        );


        return order;

    }


    async updateStatus(id, status) {


        try {


            if (!mongoose.Types.ObjectId.isValid(id)) {


                throw new AppError(
                    'INVALID_ORDER_ID',
                    {
                        orderId: id
                    }
                );

            }


            const order =

                await this.orderRepo.getById(id);


            if (!order) {


                throw new AppError(
                    'ORDER_NOT_FOUND',
                    {
                        orderId: id
                    }
                );

            }


            if (
                !Object.values(
                    ORDER_STATUS
                ).includes(status)
            ) {


                throw new AppError(
                    'INVALID_ORDER_STATUS',
                    {
                        status
                    }
                );

            }


            const updatedOrder =

                await this.orderRepo.updateStatus(
                    id,
                    status
                );


            logger.info(
                `Estado del pedido ${id} actualizado a ${status}`
            );


            return updatedOrder;


        } catch (error) {


            logger.error(
                `Error actualizando estado del pedido ${id}: ${error.message}`,
                {
                    stack: error.stack
                }
            );


            throw error;

        }

    }


    async uploadReceipt(id, file) {


        const cleanupFile = async () => {


            if (!file?.path) {

                return;

            }


            try {


                await fs.unlink(
                    file.path
                );


            } catch (error) {


                logger.warning(
                    `No se pudo eliminar el archivo ${file.path}: ${error.message}`
                );


            }

        };


        if (!mongoose.Types.ObjectId.isValid(id)) {


            await cleanupFile();


            throw new AppError(
                'INVALID_ORDER_ID',
                {
                    orderId: id
                }
            );

        }


        const order =

            await this.orderRepo.getById(id);


        if (!order) {


            await cleanupFile();


            throw new AppError(
                'ORDER_NOT_FOUND',
                {
                    orderId: id
                }
            );

        }


        if (!file) {


            throw new AppError(
                'FILE_REQUIRED'
            );

        }


        const receiptData = {


            originalName:
                file.originalname,


            filename:
                file.filename,


            path:
                file.path,


            mimetype:
                file.mimetype,


            size:
                file.size,


            uploadedAt:
                new Date()

        };


        const updatedOrder =

            await this.orderRepo.addReceipt(
                id,
                receiptData
            );


        logger.info(
            `Comprobante subido correctamente para pedido ${id}: ${file.originalname}`
        );


        return updatedOrder;

    }


}