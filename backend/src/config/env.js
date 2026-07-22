import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zomato_clone';
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV || 'development';
