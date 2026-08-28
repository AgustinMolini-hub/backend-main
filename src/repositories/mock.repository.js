import { UserModel } from '../models/user.model.js';
import { OrderModel } from '../models/order.model.js';
import { DeliveryModel } from '../models/delivery.model.js';

export class MockRepository {
    async createUsers(users) {
        return await UserModel.insertMany(users);
    }

    async createOrders(orders) {
        return await OrderModel.insertMany(orders);
    }

    async createDeliveries(deliveries) {
        return await DeliveryModel.insertMany(deliveries);
    }
}
