import express from 'express';
import { submitReview } from '../controllers/reviewControllers.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();
router.post('/submit', protect, submitReview);

export default router;