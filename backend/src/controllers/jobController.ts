import { type Request, type Response } from 'express';
import Job from '../models/Job.ts';
import User from '../models/User.ts';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}


interface MilestoneInput {
  title: string;
  amount: number;
  status: 'pending' | 'escrow_funded' | 'completed';
}

interface CreateJobBody {
  title: string;
  description: string;
  budget: number;
  category: string;
  milestones?: MilestoneInput[];
}

export const createJob = async (req: any, res: Response): Promise<Response | void> => {
  try {
    const { title, description, budget, category, milestones }: CreateJobBody = req.body;

    // Check if milestones array is empty or undefined, then create a default one using total budget
    let finalizedMilestones: MilestoneInput[] = [];

    if (milestones && milestones.length > 0) {
      finalizedMilestones = milestones;
    } else {
      finalizedMilestones = [
        {
          title: "Initial Execution Milestone",
          amount: Number(budget),
          status: 'pending'
        }
      ];
    }

    const newJob = new Job({
      title,
      description,
      budget: Number(budget),
      category,
      client: req.user.id,
      status: 'open',
      milestones: finalizedMilestones // Injecting type-safe array guarantee
    });

    await newJob.save();
    return res.status(201).json(newJob);
  } catch (error: unknown) {
    console.error("Job Creation Error:", error);
    return res.status(500).json({ message: "Server error during project schema generation." });
  }
};

// Get all open jobs (For Freelancers to browse)
export const getAllJobs = async (req: any, res: Response) => {
  try {
    // Fetch absolutely all open jobs on the platform, no matter who the client is
    const jobs = await Job.find({ status: 'open' })
      .populate('client', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching global marketplace feed.' });
  }
};

// 2. FOR THE CLIENT DASHBOARD ONLY
export const getClientOwnedJobs = async (req: any, res: Response) => {
  try {
    // Fetch every job belonging strictly to this logged-in client (open, active, under_review, completed)
    const jobs = await Job.find({ client: req.user.id })
      .populate('hiredFreelancer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving client specific job logs.' });
  }
};

export const getWorkspaceDetails = async (req: any, res: Response) => {
  const { jobId } = req.params;

  try {
    // Look for the job where ID matches, AND the user is EITHER the client OR the hired freelancer
    const job = await Job.findOne({
      _id: jobId,
      $or: [
        { client: req.user.id },
        { hiredFreelancer: req.user.id }
      ]
    }).populate('client hiredFreelancer', 'name email');

    if (!job) {
      return res.status(403).json({ message: 'Workspace entry forbidden: Unauthorized node identifier.' });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error inside workspace telemetry.' });
  }
};


export const getSingleWorkspaceJob = async (req: any, res: Response) => {
  const { jobId } = req.params;

  try {
    // Aisa query document extract karo jahan job ID match kare AND 
    // login user user token ya to Client ho ya fir Hired Freelancer!
    const job = await Job.findOne({
      _id: jobId,
      $or: [
        { client: req.user.id },
        { hiredFreelancer: req.user.id }
      ]
    }).populate('client hiredFreelancer', 'name email');

    if (!job) {
      return res.status(403).json({ message: 'Unauthorized entry: Logged user matching reference not found.' });
    }

    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: 'Database failed to query contract telemetry variables.' });
  }
};



export const submitWork = async (req: any, res: Response) => {
  const { jobId } = req.params;
  const { deliveryNotes, fileUrl } = req.body;

  try {
    // Check if the job exists and if the logged-in user is actually the hired freelancer
    const job = await Job.findOne({ _id: jobId, hiredFreelancer: req.user.id }) as any;

    if (!job) {
      return res.status(403).json({ message: 'Unauthorized: You are not the hired freelancer for this contract.' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'Submission rejected: Contract is not in an active running state.' });
    }

    // Save the submission details and mutate status flag
    job.set({ deliveryNotes, fileUrl, status: 'under_review' });

    await job.save();
    return res.status(200).json({ message: 'Deliverables registered. Awaiting client audit.', job });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error during work deployment logic.' });
  }
};

// 2. CLIENT FETCHES SUBMITTED WORK DETAILS
export const getSubmissionDetails = async (req: any, res: Response) => {
  const { jobId } = req.params;

  try {
    // Verify that the requester is either the client or the freelancer linked to this job
    const job = await Job.findOne({
      _id: jobId,
      $or: [{ client: req.user.id }, { hiredFreelancer: req.user.id }]
    }) as any;

    if (!job) {
      return res.status(403).json({ message: 'Access Denied: Unauthorized data handshake route.' });
    }

    return res.status(200).json({
      deliveryNotes: job.deliveryNotes || '',
      fileUrl: job.fileUrl || ''
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve structural submission metadata.' });
  }
};

import type { IUser } from '../models/User.ts';

// Custom interface to authorize req.user without any keyword
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}


export const approveAndCompleteJob = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  const { jobId } = req.params;
  const { rating, comment } = req.body;

  try {
    // 1. Job document fetch karo
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Contract document missing.' });
    }

    if (job.status === 'completed') {
      return res.status(400).json({ message: 'Transaction route already terminated and completed.' });
    }

    // Validation Check: Agar user rating submit kar raha hai toh wo valid range me ho
    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5.' });
    }

    // 2. Shift Core Job Status state parameters
    job.status = 'completed';
    await job.save();

    // 3. Fetch freelancer to route funds and update trust metrics
    const freelancer = await (User as any).findById(job.hiredFreelancer);
    
    if (freelancer) {
      // Wallet Balance Update Logic
      const currentBalance = Number(freelancer.walletBalance || 0);
      const contractReleaseValuation = Number(job.budget || 0);
      freelancer.walletBalance = currentBalance + contractReleaseValuation;

      // --- NEW RATING & REVIEW RECALCULATION ENGINE ---
      const totalReviewsBefore = Number(freelancer.totalReviews || 0);
      const averageRatingBefore = Number(freelancer.averageRating || 0);

      // New Total Reviews Count
      const newTotalReviews = totalReviewsBefore + 1;
      
      // Math Equation for Cumulative Moving Average:
      // $NewAverage = \frac{(OldAverage \times OldCount) + NewRating}{NewCount}$
      const newAverageRating = ((averageRatingBefore * totalReviewsBefore) + numericRating) / newTotalReviews;

      // Update Freelancer stats safely
      freelancer.totalReviews = newTotalReviews;
      freelancer.averageRating = Number(newAverageRating.toFixed(1)); // e.g. 4.3678 becomes 4.4

      // Safely pushing the fresh review to the reviewer node (Mongoose mixin fallback check)
      if (!(freelancer as any).reviews) {
        (freelancer as any).reviews = [];
      }
      (freelancer as any).reviews.push({
        from: req.user?.id || job.client, // dynamically matching corporate client id
        rating: numericRating,
        comment: comment || 'Project completed successfully!'
      });

      await freelancer.save();

      return res.status(200).json({
        message: 'Milestone escrow released and Freelancer rating updated successfully.',
        status: 'completed',
        updatedRating: freelancer.averageRating
      });
    } else {
      return res.status(404).json({ message: 'Hired freelancer profile node not found.' });
    }

  } catch (error: unknown) {
    console.error("Escrow allocation and rating error trace:", error);
    return res.status(500).json({ message: 'Internal pipeline fault allocating escrow funds and review metrics.' });
  }
};



// 2. Completed project par baad me rating dene ke liye
export const submitJobRatingOnly = async (req: any, res: Response): Promise<Response | void> => {
  const { jobId } = req.params;
  const { rating, comment } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job document missing.' });

    const numericRating = Number(rating);
    const freelancer = await (User as any).findById(job.hiredFreelancer);
    
    if (freelancer) {
      const totalReviewsBefore = Number(freelancer.totalReviews || 0);
      const averageRatingBefore = Number(freelancer.averageRating || 0);

      const newTotalReviews = totalReviewsBefore + 1;
      const newAverageRating = ((averageRatingBefore * totalReviewsBefore) + numericRating) / newTotalReviews;

      freelancer.totalReviews = newTotalReviews;
      freelancer.averageRating = Number(newAverageRating.toFixed(1));

      if (!(freelancer as any).reviews) (freelancer as any).reviews = [];
      
      (freelancer as any).reviews.push({
        from: req.user?.id || String((job as any).client),
        rating: numericRating,
        comment: comment || 'Project completed successfully!'
      });

      await freelancer.save();
      return res.status(200).json({ message: 'Rating synced directly to freelancer profile!' });
    }
    return res.status(404).json({ message: 'Freelancer not found.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving rating.' });
  }
};