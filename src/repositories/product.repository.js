import { ProductModel } from '../models/product.model.js';


export class ProductRepository {


    async getAll(
        filter = {},
        page = 1,
        limit = 10
    ) {

        const skip =
            (page - 1) * limit;


        const [
            products,
            total
        ] = await Promise.all([

            ProductModel
                .find(filter)
                .select('-__v')
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            ProductModel.countDocuments(
                filter
            )

        ]);


        return {

            data:
                products,

            pagination: {

                page,

                limit,

                total,

                totalPages:
                    Math.ceil(
                        total / limit
                    )

            }

        };

    }




    async getById(id) {

        return await ProductModel
            .findById(id)
            .select('-__v')
            .lean();

    }




    async create(data) {

        return await ProductModel.create(data);

    }




    async update(id, data) {

        return await ProductModel
            .findByIdAndUpdate(
                id,
                data,
                {
                    new: true,
                    runValidators: true
                }
            )
            .select('-__v')
            .lean();

    }


}