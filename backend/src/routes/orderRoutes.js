import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// All order routes are protected
router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);

router.get('/:id', validateObjectId('id'), getOrderById);
router.put('/:id/status', restrictTo('partner', 'admin'), validateObjectId('id'), updateOrderStatus);

export default router;
