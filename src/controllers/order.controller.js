import { OrderService } from '../services/order.service.js';

const orderService = new OrderService();


export class OrderController {


    static async getAll(req, res, next) {

        try {

            const {
                page,
                limit
            } = req.query;


            const result =
                await orderService.getAllOrders(
                    page,
                    limit
                );


            return res.status(200).json({

                status: 'success',

                payload: result.data,

                pagination: result.pagination

            });


        } catch (error) {

            next(error);

        }

    }


    static async getById(req, res, next) {

        try {

            const {
                id
            } = req.params;


            const order =
                await orderService.getOrderById(id);


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

            const order =
                await orderService.createOrder(
                    req.body
                );


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

            const {
                id
            } = req.params;


            const {
                status
            } = req.body;


            const order =
                await orderService.updateStatus(
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


    static async uploadReceipt(req, res, next) {

        try {

            const {
                id
            } = req.params;


            const order =
                await orderService.uploadReceipt(
                    id,
                    req.file
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