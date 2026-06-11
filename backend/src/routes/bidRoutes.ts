import express from 'express';
import { placeBid, getBidsByJob, acceptBid , getAllJobsbid } from '../controllers/bidController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.get('/', protect, getAllJobsbid);
router.post('/', protect, placeBid);
router.get('/:jobId', protect, getBidsByJob);
router.post('/accept-bid', protect, acceptBid);

export default router;