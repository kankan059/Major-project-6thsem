import { type Response } from 'express';
import Review from '../models/Review.ts';
import User from '../models/User.ts';
import Job from '../models/Job.ts';

export const submitReview = async (req: any, res: Response) => {
  try {
    const { jobId, rating, comment } = req.body;
    const job = await Job.findById(jobId);

    // 1. Check if job is completed and user is the client
    if (!job || job.status !== 'completed' || job.client.toString() !== req.user.id) {
      return res.status(400).json({ message: 'Cannot review this job' });
    }

    // 2. Create Review
    await Review.create({
      job: jobId,
      from: req.user.id,
      to: job.hiredFreelancer,
      rating,
      comment
    });

    // 3. Update Freelancer's Average Rating
    const freelancer = await User.findById(job.hiredFreelancer);
    if (freelancer) {
      const newTotalReviews = freelancer.totalReviews + 1;
      freelancer.averageRating = ((freelancer.averageRating * freelancer.totalReviews) + rating) / newTotalReviews;
      freelancer.totalReviews = newTotalReviews;
      await freelancer.save();
    }

    res.json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review' });
  }
};