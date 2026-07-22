import express from 'express';
import {
  getFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from '../controllers/foodItemController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router
  .route('/')
  .get(getFoodItems)
  .post(protect, restrictTo('partner', 'admin'), createFoodItem);

router
  .route('/:id')
  .put(protect, restrictTo('partner', 'admin'), validateObjectId('id'), updateFoodItem)
  .delete(protect, restrictTo('partner', 'admin'), validateObjectId('id'), deleteFoodItem);

export default router;
