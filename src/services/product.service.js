import { ProductRepository } from '../repositories/product.repository.js';
import { PRODUCT_STATUS } from '../constants/index.js';

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
    const product = await this.productRepo.getById(id);
    if (!product) {
      throw new Error(`El producto con ID ${id} no existe.`);
    }
    return product;
  }

  async createProduct(data) {
    if (!data.name || data.price === undefined) {
      throw new Error('El nombre y el precio son campos obligatorios.');
    }
    if (data.price <= 0) {
      throw new Error('El precio debe ser un número positivo.');
    }

    const stock = data.stock ?? 0;
    const status = stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;

    return await this.productRepo.create({
      ...data,
      stock,
      status
    });
  }
}