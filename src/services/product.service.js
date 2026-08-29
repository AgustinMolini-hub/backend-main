import mongoose from 'mongoose';

import { ProductRepository } from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';
import { AppError } from '../errors/app.error.js';



export class ProductService {


    constructor() {

        this.productRepo = new ProductRepository();

    }





    async getAllProducts(onlyAvailable = false) {

        const filter = {};


        if (onlyAvailable) {

            filter.status = PRODUCT_STATUS.AVAILABLE;

        }


        return await this.productRepo.getAll(filter);

    }







    async getProductById(id) {


        if (!mongoose.Types.ObjectId.isValid(id)) {


            throw new AppError(
                'INVALID_PRODUCT_ID',
                {
                    productId: id
                }
            );

        }





        const product =
            await this.productRepo.getById(id);





        if (!product) {


            throw new AppError(
                'PRODUCT_NOT_FOUND',
                {
                    productId: id
                }
            );

        }





        return product;

    }








    async createProduct(data) {


        if (!data.name || data.price === undefined) {


            throw new AppError(
                'INVALID_PRODUCT_DATA'
            );

        }





        if (
            typeof data.price !== 'number' ||
            Number.isNaN(data.price) ||
            data.price <= 0
        ) {


            throw new AppError(
                'INVALID_PRODUCT_PRICE'
            );

        }






        const stock = data.stock ?? 0;





        if (
            typeof stock !== 'number' ||
            Number.isNaN(stock) ||
            stock < 0
        ) {


            throw new AppError(
                'INVALID_PRODUCT_STOCK'
            );

        }






        const status =
            stock > 0
                ? PRODUCT_STATUS.AVAILABLE
                : PRODUCT_STATUS.OUT_OF_STOCK;







        return await this.productRepo.create({

            ...data,

            stock,

            status

        });


    }









    async updateProduct(id, data) {


        if (!mongoose.Types.ObjectId.isValid(id)) {


            throw new AppError(
                'INVALID_PRODUCT_ID',
                {
                    productId: id
                }
            );

        }





        const product =
            await this.productRepo.getById(id);





        if (!product) {


            throw new AppError(
                'PRODUCT_NOT_FOUND',
                {
                    productId: id
                }
            );

        }








        if (data.price !== undefined) {


            if (
                typeof data.price !== 'number' ||
                Number.isNaN(data.price) ||
                data.price <= 0
            ) {


                throw new AppError(
                    'INVALID_PRODUCT_PRICE'
                );

            }

        }








        if (data.stock !== undefined) {


            if (
                typeof data.stock !== 'number' ||
                Number.isNaN(data.stock) ||
                data.stock < 0
            ) {


                throw new AppError(
                    'INVALID_PRODUCT_STOCK'
                );

            }






            data.status =
                data.stock > 0
                    ? PRODUCT_STATUS.AVAILABLE
                    : PRODUCT_STATUS.OUT_OF_STOCK;


        }







        return await this.productRepo.update(
            id,
            data
        );


    }




}