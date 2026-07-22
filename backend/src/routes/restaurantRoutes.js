import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router
  .route('/')
  .get(getAllRestaurants)
  .post(protect, restrictTo('partner', 'admin'), createRestaurant);

router
  .route('/:id')
  .get(validateObjectId('id'), getRestaurantById)
  .put(protect, restrictTo('partner', 'admin'), validateObjectId('id'), updateRestaurant)
  .delete(protect, restrictTo('partner', 'admin'), validateObjectId('id'), deleteRestaurant);

export default router;
