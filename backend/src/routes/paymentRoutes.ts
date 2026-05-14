import express from 'express';
import { createMilestoneOrder, verifyPayment } from '../controllers/paymentController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/create-order', protect, createMilestoneOrder);
router.post('/verify', protect, verifyPayment);

export default router;