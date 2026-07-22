import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  addAddress,
  deleteAddress,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/me').get(getProfile).put(updateProfile);
router.put('/me/password', updatePassword);
router.post('/me/addresses', addAddress);
router.delete('/me/addresses/:index', deleteAddress);

export default router;
