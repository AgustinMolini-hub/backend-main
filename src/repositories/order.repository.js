import { OrderModel } from '../models/order.model.js';



export class OrderRepository {



    async getAll() {

        return await OrderModel
            .find()
            .populate(
                'user',
                'name email role'
            )
            .select('-__v')
            .sort({
                createdAt: -1
            })
            .lean();

    }







    async getById(id) {

        return await OrderModel
            .findById(id)
            .populate(
                'user',
                'name email role'
            )
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
                    new:true,
                    runValidators:true
                }

            )
            .populate(
                'user',
                'name email role'
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
                    receipt:receiptData
                },

                {
                    new:true,
                    runValidators:true
                }

            )
            .populate(
                'user',
                'name email role'
            )
            .select('-__v')
            .lean();


    }



}