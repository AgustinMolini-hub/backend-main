import { Schema, model } from 'mongoose';

import { ROLES } from '../constants/index.js';

const documentSchema = new Schema(
  {
    originalName: {
      type: String,
      required: true
    },

    filename: {
      type: String,
      required: true
    },

    path: {
      type: String,
      required: true
    },

    mimetype: {
      type: String,
      required: true
    },

    size: {
      type: Number,
      required: true
    },

    documentType: {
      type: String,
      required: true,
      enum: ['DNI', 'LICENSE', 'OTHER']
    },

    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    },

    documents: {
      type: [documentSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema);