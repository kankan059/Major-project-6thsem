import express from 'express';
import {
    createJob, getAllJobs, getClientOwnedJobs, getWorkspaceDetails, getSingleWorkspaceJob, submitWork,                  // <-- New
    getSubmissionDetails,       
    approveAndCompleteJob,
    submitJobRatingOnly
} from '../controllers/jobController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = express.Router();
// Protected: Only logged in users can see/post jobs
router.post('/', protect, createJob);
router.get('/', protect, getAllJobs);
router.post('/approve-complete/:jobId', protect, approveAndCompleteJob);
router.get('/client-owned', protect, getClientOwnedJobs);
router.get('/workspace/:jobId', protect, getWorkspaceDetails);
router.get('/workspace-node/:jobId', protect, getSingleWorkspaceJob);
router.post('/:jobId/submit', protect, submitWork);
router.get('/:jobId/submission', protect, getSubmissionDetails);
router.put('/submit-rating/:jobId', protect, submitJobRatingOnly);


export default router;