import { Schema, model } from 'mongoose';
import { DELIVERY_STATUS } from '../constants/index.js';

const deliverySchema = new Schema(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: Object.values(DELIVERY_STATUS),
            default: DELIVERY_STATUS.PENDING
        }
    },
    { timestamps: true }
);

export const DeliveryModel = model('Delivery', deliverySchema);
