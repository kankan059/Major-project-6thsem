import {type Request, type Response } from 'express';
import Job from '../models/Job.ts';

// Create a new Job (Only for Clients)
export const createJob = async (req: any, res: Response) => {
  try {
    // Role check: Only clients can post jobs
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can post jobs' });
    }

    const { title, description, budget, category } = req.body;

    const job = await Job.create({
      client: req.user.id,
      title,
      description,
      budget,
      category
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job' });
  }
};

// Get all open jobs (For Freelancers to browse)
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({ status: 'open' }).populate('client', 'name email');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
};
