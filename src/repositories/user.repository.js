import { UserModel } from '../models/user.model.js';

export class UserRepository {

    async getAll() {
        return await UserModel
            .find()
            .select('-__v')
            .sort({ createdAt: -1 })
            .lean();
    }

    async getById(id) {
        return await UserModel
            .findById(id)
            .select('-__v')
            .lean();
    }

    async getByEmail(email) {
        return await UserModel
            .findOne({ email })
            .select('-__v')
            .lean();
    }

    async create(data) {
        return await UserModel.create(data);
    }

    async addDocument(id, documentData) {
        return await UserModel
            .findByIdAndUpdate(
                id,
                {
                    $push: {
                        documents: documentData
                    }
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