import { type Response } from 'express';
import Job from '../models/Job.ts';
import { razorpay } from '../config/razorpay.ts';
import crypto from 'crypto';

interface OrderRequestBody {
  jobId: string;
  milestoneIndex: string | number;
}

interface VerifyRequestBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  jobId: string;
  milestoneIndex: string | number;
}

export const createMilestoneOrder = async (req: any, res: Response): Promise<Response | void> => {
  try {
    const { jobId, milestoneIndex }: OrderRequestBody = req.body;

    const job = await Job.findById(jobId);
    if (!job || job.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this project.' });
    }

    // SAFE TESTING FALLBACK: If milestones array is missing or empty, bind with absolute job budget directly
    let orderAmount = 0;
    if (job.milestones && job.milestones.length > 0) {
      const mIndex = Number(milestoneIndex);
      const milestone = job.milestones[mIndex];
      if (milestone) {
        orderAmount = Math.round(milestone.amount * 100);
      }
    }

    if (orderAmount === 0) {
      orderAmount = Math.round((job.budget || 500) * 100); // Uses total project budget in paise
    }

    const options = {
      amount: orderAmount, 
      currency: "INR",
      receipt: `receipt_job_${jobId}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Dynamically tracking order inside root schema if milestones array layer is bypassed
    (job as any).razorpayOrderId = order.id;
    await job.save();

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: unknown) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ message: 'Razorpay Order Error configuration failed.' });
  }
};





export const verifyPayment = async (req: any, res: Response): Promise<Response> => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature, 
    jobId, 
    milestoneIndex 
  }: VerifyRequestBody = req.body;

  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      const job = await Job.findById(jobId);
      const mIndex = Number(milestoneIndex);
      
      if (job && job.milestones && job.milestones[mIndex]) {
        
        // Fully type-safe structural status mutation
        const milestoneObject = job.milestones[mIndex] as { status: string };
        milestoneObject.status = 'escrow_funded';
        
        job.markModified('milestones');
        await job.save();
        
        return res.json({ status: 'success' });
      } else {
        return res.status(404).json({ message: 'Job or Milestone not found' });
      }
    } else {
      return res.status(400).json({ status: 'failure', message: 'Invalid signature verification mismatch.' });
    }
  } catch (error: unknown) {
    console.error("Verification Internal Error:", error);
    return res.status(500).json({ message: 'Server Error verifying payment signatures.' });
  }
};