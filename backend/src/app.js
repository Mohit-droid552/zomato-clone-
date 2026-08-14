import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { CLIENT_URL, NODE_ENV } from './config/env.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import foodItemRoutes from './routes/foodItemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// Request logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === CLIENT_URL || origin.endsWith('.vercel.app') || NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Zomato Clone API is running and healthy',
    timestamp: new Date(),
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/food-items', foodItemRoutes);
app.use('/api/v1/orders', orderRoutes);

// Fallback for unhandled routes
app.use('*', (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - Path: ${req.originalUrl}`);
  next(error);
});

// Global Error Handler
app.use(errorHandler);

export default app;
