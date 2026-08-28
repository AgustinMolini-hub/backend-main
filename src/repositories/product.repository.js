import { ProductModel } from '../models/product.model.js';

export class ProductRepository {
  async getAll(filter = {}) {
    return await ProductModel.find(filter).select('-__v').sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    return await ProductModel.findById(id).select('-__v').lean();
  }

  async create(data) {
    return await ProductModel.create(data);
  }

  async update(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-__v');
  }

  async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}