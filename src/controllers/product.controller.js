import { ProductService } from '../services/product.service.js';


const productService =
    new ProductService();



export class ProductController {



    static async getAll(req, res, next) {

        try {


            const {
                available,
                page,
                limit
            } = req.query;



            const result =
                await productService.getAllProducts(
                    available === 'true',
                    page,
                    limit
                );



            return res.status(200).json({

                status: 'success',

                payload:
                    result.data,

                pagination:
                    result.pagination

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



            const product =
                await productService.getProductById(id);





            return res.status(200).json({

                status: 'success',

                payload: product

            });



        } catch (error) {

            next(error);

        }

    }









    static async create(req, res, next) {

        try {


            const product =
                await productService.createProduct(
                    req.body
                );





            return res.status(201).json({

                status: 'success',

                payload: product

            });



        } catch (error) {

            next(error);

        }

    }









    static async update(req, res, next) {

        try {


            const {
                id
            } = req.params;




            const product =
                await productService.updateProduct(
                    id,
                    req.body
                );





            return res.status(200).json({

                status: 'success',

                payload: product

            });



        } catch (error) {

            next(error);

        }

    }




}