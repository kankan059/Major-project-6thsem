import express from 'express';
import { getPublicProfile, updateProfile } from '../controllers/userController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();
router.get('/profile/:userId', protect, getPublicProfile);
router.put('/profile/update', protect, updateProfile);


export default router;