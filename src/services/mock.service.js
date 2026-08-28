import {
    ROLES,
    ORDER_STATUS,
    ORDER_PRIORITY,
    DELIVERY_STATUS
} from '../constants/index.js';

import { MockRepository } from '../repositories/mock.repository.js';
import { AppError } from '../errors/app.error.js';

export class MockService {
    constructor() {
        this.mockRepository = new MockRepository();
    }

    validateQuantity(quantity) {
        if (typeof quantity !== 'number' || Number.isNaN(quantity)) {
            throw new AppError('INVALID_MOCK_QUANTITY');
        }

        if (quantity < 0) {
            throw new AppError('NEGATIVE_MOCK_QUANTITY');
        }

        if (!Number.isInteger(quantity) || quantity === 0) {
            throw new AppError('INVALID_MOCK_QUANTITY');
        }

        if (quantity > 100) {
            throw new AppError('MAX_MOCK_QUANTITY');
        }
    }

    generateUsers(quantity) {
        const users = [];

        for (let i = 1; i <= quantity; i++) {
            users.push({
                _id: this.generateMockId(),
                name: `Usuario Mock ${i}`,
                email: `usuario.mock.${Date.now()}.${i}@test.com`,
                role: ROLES.USER
            });
        }

        return users;
    }

    generateDrivers(quantity) {
        const drivers = [];

        for (let i = 1; i <= quantity; i++) {
            drivers.push({
                _id: this.generateMockId(),
                name: `Repartidor Mock ${i}`,
                email: `driver.mock.${Date.now()}.${i}@test.com`,
                role: ROLES.DRIVER
            });
        }

        return drivers;
    }

    generateMockId() {
        return `${Date.now()}${Math.random()
            .toString(36)
            .substring(2, 10)}`;
    }

    generateMockData(quantity) {
        this.validateQuantity(quantity);

        const users = this.generateUsers(quantity);
        const drivers = this.generateDrivers(quantity);

        const orders = users.map(user => ({
            _id: this.generateMockId(),
            user: user._id,
            status: ORDER_STATUS.PENDING,
            priority: ORDER_PRIORITY.MEDIUM,
            total: Number(
                (Math.random() * 100000 + 1000).toFixed(2)
            )
        }));

        const deliveries = orders.map((order, index) => ({
            _id: this.generateMockId(),
            order: order._id,
            driver: drivers[index % drivers.length]._id,
            status: DELIVERY_STATUS.ASSIGNED
        }));

        return {
            users,
            drivers,
            orders,
            deliveries
        };
    }

    async seed(quantity) {
        this.validateQuantity(quantity);

        try {
            const users = this.generateUsers(quantity);

            const drivers = this.generateDrivers(
                Math.max(1, Math.ceil(quantity / 2))
            );

            const usersToInsert = users.map(({ _id, ...user }) => user);
            const driversToInsert = drivers.map(({ _id, ...driver }) => driver);

            const createdUsers =
                await this.mockRepository.createUsers([
                    ...usersToInsert,
                    ...driversToInsert
                ]);

            const createdCustomers = createdUsers.filter(
                user => user.role === ROLES.USER
            );

            const createdDrivers = createdUsers.filter(
                user => user.role === ROLES.DRIVER
            );

            const ordersData = createdCustomers.map(user => ({
                user: user._id,
                status: ORDER_STATUS.PENDING,
                priority: ORDER_PRIORITY.MEDIUM,
                total: Number(
                    (Math.random() * 100000 + 1000).toFixed(2)
                )
            }));

            const createdOrders =
                await this.mockRepository.createOrders(ordersData);

            const deliveriesData = createdOrders.map(
                (order, index) => ({
                    order: order._id,
                    driver: createdDrivers[
                        index % createdDrivers.length
                    ]._id,
                    status: DELIVERY_STATUS.ASSIGNED
                })
            );

            const createdDeliveries =
                await this.mockRepository.createDeliveries(
                    deliveriesData
                );

            return {
                users: createdCustomers.length,
                drivers: createdDrivers.length,
                orders: createdOrders.length,
                deliveries: createdDeliveries.length
            };

        } catch (error) {
            console.error('Error durante seed de mocks:', error);

            throw new AppError(
                'MOCK_SEED_ERROR',
                error.message
            );
        }
    }
}
