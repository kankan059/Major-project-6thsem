import express from 'express';
import { createJob, getAllJobs} from '../controllers/jobController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();

// Protected: Only logged in users can see/post jobs
router.post('/', protect, createJob);
router.get('/', protect, getAllJobs);


export default router;