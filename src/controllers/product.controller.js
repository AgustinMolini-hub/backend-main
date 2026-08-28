import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
  static async getAll(req, res, next) {
    try {
      const { available } = req.query;

      const products = await productService.getAllProducts(
        available === 'true'
      );

      return res.status(200).json({
        status: 'success',
        payload: products
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(id);

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
      const newProduct = await productService.createProduct(req.body);

      return res.status(201).json({
        status: 'success',
        payload: newProduct
      });
    } catch (error) {
      next(error);
    }
  }
}
