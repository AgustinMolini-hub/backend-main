import { OrderModel } from '../models/order.model.js';


export class OrderRepository {


    async getAll(page = 1, limit = 10) {

        const skip = (page - 1) * limit;


        const [orders, total] = await Promise.all([

            OrderModel
                .find()
                .select('-__v')
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            OrderModel.countDocuments()

        ]);


        return {

            data: orders,

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }

        };

    }


    async getById(id) {

        return await OrderModel
            .findById(id)
            .select('-__v')
            .lean();

    }


    async create(data) {

        return await OrderModel.create(data);

    }


    async updateStatus(
        id,
        status
    ) {

        return await OrderModel
            .findByIdAndUpdate(

                id,

                {
                    status
                },

                {
                    new: true,
                    runValidators: true
                }

            )
            .select('-__v')
            .lean();

    }


    async addReceipt(
        id,
        receiptData
    ) {

        return await OrderModel
            .findByIdAndUpdate(

                id,

                {
                    receipt: receiptData
                },

                {
                    new: true,
                    runValidators: true
                }

            )
            .select('-__v')
            .lean();

    }


}