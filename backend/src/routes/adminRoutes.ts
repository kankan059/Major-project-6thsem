import express from 'express';
import { registerUser, loginUser } from '../controllers/authControllers.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { getAllUsersForAdmin } from '../controllers/adminController.ts';
const router = express.Router();
router.get('/users', protect, getAllUsersForAdmin);
export default router;