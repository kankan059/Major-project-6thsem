import { type Response } from 'express';
import Job from '../models/Job.ts';
import { razorpay } from '../config/razorpay.ts';
import crypto from 'crypto';

// 1. Create Order for a Milestone
export const createMilestoneOrder = async (req: any, res: Response) => {
  try {
    const { jobId, milestoneIndex } = req.body;
    const mIndex = Number(milestoneIndex); 

    const job = await Job.findById(jobId);

    // Basic validation
    if (!job || job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if milestone exists at this index
    const milestone = job.milestones[mIndex];
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const options = {
      amount: Math.round(milestone.amount * 100), 
      currency: "INR",
      receipt: `receipt_job_${jobId}_m_${mIndex}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Save orderId (TypeScript safe way)
    (job.milestones[mIndex] as any).razorpayOrderId = order.id;

    // IMPORTANT: Mongoose ko batana padega ki array update hua hai
    job.markModified('milestones');
    await job.save();

    res.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ message: 'Razorpay Order Error' });
  }
};

// 2. Verify Payment Signature
export const verifyPayment = async (req: any, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId, milestoneIndex } = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      const job = await Job.findById(jobId);
      
      // Check if job exists and milestone index is valid
      if (job && job.milestones && job.milestones[Number(milestoneIndex)]) {
        
        // 1. Status update (Explicit casting to avoid TS error)
        (job.milestones[Number(milestoneIndex)] as any).status = 'escrow_funded';
        
        // 2. IMPORTANT: Mongoose ko batana padta hai ki array change hua hai
        job.markModified('milestones');
        
        await job.save();
        return res.json({ status: 'success' });
      } else {
        return res.status(404).json({ message: 'Job or Milestone not found' });
      }
    } else {
      return res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};