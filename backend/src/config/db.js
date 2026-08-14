import mongoose from 'mongoose';
import { MONGODB_URI } from './env.js';

// Disable buffering commands to prevent hanging on disconnected states
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
  }
};
