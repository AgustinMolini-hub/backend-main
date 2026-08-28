import fs from 'fs';
import path from 'path';

const files = {
  'package.json': `{
  "name": "shipnow-backend",
  "version": "1.0.0",
  "description": "API REST para ShipNow refactorizada por capas",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.3.1"
  }
}`,

  '.env.example': `PORT=8080
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/shipnow_db
NODE_ENV=development`,

  'src/config/env.config.js': `import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'PORT', 'NODE_ENV'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(\`Error grave: La variable de entorno \${envVar} no está configurada.\`);
    process.exit(1);
  }
}

export const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || 'development'
};`,

  'src/constants/index.js': `export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER'
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DISCONTINUED: 'DISCONTINUED'
});`,

  'src/models/product.model.js': `import { Schema, model } from 'mongoose';
import { PRODUCT_STATUS } from '../constants/index.js';

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.AVAILABLE
    }
  },
  { timestamps: true }
);

export const ProductModel = model('Product', productSchema);`,

  'src/models/user.model.js': `import { Schema, model } from 'mongoose';
import { ROLES } from '../constants/index.js';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER
    }
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema);`,

  'src/repositories/product.repository.js': `import { ProductModel } from '../models/product.model.js';

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
}`,

  'src/repositories/user.repository.js': `import { UserModel } from '../models/user.model.js';

export class UserRepository {
  async getAll() {
    return await UserModel.find().select('-__v').sort({ createdAt: -1 }).lean();
  }

  async getById(id) {
    return await UserModel.findById(id).select('-__v').lean();
  }

  async getByEmail(email) {
    return await UserModel.findOne({ email }).select('-__v').lean();
  }

  async create(data) {
    return await UserModel.create(data);
  }
}`,

  'src/services/product.service.js': `import { ProductRepository } from '../repositories/product.repository.js';
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
      throw new Error(\`El producto con ID \${id} no existe.\`);
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
}`,

  'src/services/user.service.js': `import { UserRepository } from '../repositories/user.repository.js';
import { ROLES } from '../constants/index.js';

export class UserService {
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getAllUsers() {
    return await this.userRepo.getAll();
  }

  async registerUser(data) {
    if (!data.email || !data.name) {
      throw new Error('El nombre y el email son obligatorios.');
    }

    const existingUser = await this.userRepo.getByEmail(data.email);
    if (existingUser) {
      throw new Error('Ya existe un usuario registrado con este email.');
    }

    const role = Object.values(ROLES).includes(data.role) ? data.role : ROLES.USER;

    return await this.userRepo.create({
      ...data,
      role
    });
  }
}`,

  'src/controllers/product.controller.js': `import { ProductService } from '../services/product.service.js';

const productService = new ProductService();

export class ProductController {
  static async getAll(req, res) {
    try {
      const { available } = req.query;
      const products = await productService.getAllProducts(available === 'true');
      res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}`,

  'src/controllers/user.controller.js': `import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ status: 'success', payload: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newUser = await userService.registerUser(req.body);
      res.status(201).json({ status: 'success', payload: newUser });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}`,

  'src/routes/product.routes.js': `import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', ProductController.create);

export default router;`,

  'src/routes/user.routes.js': `import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

router.get('/', UserController.getAll);
router.post('/', UserController.create);

export default router;`,

  'src/app.js': `import express from 'express';
import productRouter from './routes/product.routes.js';
import userRouter from './routes/user.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;`,

  'src/server.js': `import mongoose from 'mongoose';
import app from './app.js';
import { config } from './config/env.config.js';

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conexión exitosa a MongoDB');

    app.listen(config.port, () => {
      console.log(\`Servidor escuchando en el puerto \${config.port} en modo \${config.nodeEnv}\`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
}

startServer();`,

  'README.md': `# ShipNow API - Architecture Layering

API REST refactorizada aplicando la arquitectura de 3 capas (Controller - Service - Repository) y configuración de entorno estricta.

## 🚀 Instalación y Ejecución

1. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`

2. Configurar variables de entorno:
   Copiar \`.env.example\` a \`.env\` y configurar la URI de MongoDB:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Iniciar servidor:
   \`\`\`bash
   npm run dev
   \`\`\`
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
});

console.log('✅ Proyecto creado exitosamente.');