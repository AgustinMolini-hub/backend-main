import { Schema, model } from 'mongoose';

import {
    ORDER_STATUS,
    ORDER_PRIORITY
} from '../constants/index.js';

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING
        },

        priority: {
            type: String,
            enum: Object.values(ORDER_PRIORITY),
            default: ORDER_PRIORITY.MEDIUM
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        receipt: {
            originalName: {
                type: String
            },

            filename: {
                type: String
            },

            path: {
                type: String
            },

            mimetype: {
                type: String
            },

            size: {
                type: Number
            },

            uploadedAt: {
                type: Date
            }
        }
    },
    { timestamps: true }
);

export const OrderModel = model('Order', orderSchema);