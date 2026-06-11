import express from 'express';
import { sendMessageAPI, getChatHistory } from '../controllers/messaage.controllers.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.post('/', protect, sendMessageAPI);
router.get('/:jobId', protect, getChatHistory);

export default router;