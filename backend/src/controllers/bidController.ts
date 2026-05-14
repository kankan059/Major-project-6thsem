import { type Response } from 'express';
import Bid from '../models/Bid.ts';
import Job from '../models/Job.ts';

// Place a Bid
export const placeBid = async (req: any, res: Response) => {
  try {
    const { jobId, bidAmount, proposalText, estimatedDays } = req.body;

    // 1. Role Check
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can place bids' });
    }

    // 2. Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      return res.status(400).json({ message: 'Job is not available for bidding' });
    }

    // 3. Prevent client from bidding on their own job
    if (job.client.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot bid on your own job' });
    }

    const bid = await Bid.create({
      job: jobId,
      freelancer: req.user.id,
      bidAmount,
      proposalText,
      estimatedDays
    });

    res.status(201).json(bid);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already placed a bid on this job' });
    }
    res.status(500).json({ message: 'Error placing bid' });
  }
};

// Get all bids for a specific job (Only for the Job Owner)
export const getBidsByJob = async (req: any, res: Response) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job || job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to view bids for this job' });
    }

    const bids = await Bid.find({ job: req.params.jobId }).populate('freelancer', 'name email skills rating');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bids' });
  }
};

export const acceptBid = async (req: any, res: Response) => {
  try {
    const { jobId, bidId } = req.body;

    //  Check if Job exists and belongs to the Client
    const job = await Job.findById(jobId);
    if (!job || job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    //  Check if Bid exists
    const selectedBid = await Bid.findById(bidId);
    if (!selectedBid || selectedBid.job.toString() !== jobId) {
      return res.status(400).json({ message: 'Invalid Bid' });
    }

    //  Update Job status and hired freelancer
    job.status = 'active';
    job.hiredFreelancer = selectedBid.freelancer;
    await job.save();

    //  Update the selected bid status
    selectedBid.status = 'accepted';
    await selectedBid.save();

    // Optional: Reject all other bids for this job
    await Bid.updateMany(
      { job: jobId, _id: { $ne: bidId } },
      { status: 'rejected' }
    );

    res.json({ message: 'Bid accepted and job started', job });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting bid' });
  }
};