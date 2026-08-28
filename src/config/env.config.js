import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'PORT', 'NODE_ENV'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error grave: La variable de entorno ${envVar} no está configurada.`);
    process.exit(1);
  }
}

export const config = {
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV || 'development'
};