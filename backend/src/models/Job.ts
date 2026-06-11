import mongoose, { Schema, Document } from 'mongoose';
interface IMilestone {
  title: string;
  amount: number;
  status: 'pending' | 'escrow_funded' | 'completed' | 'released' | "under_review";
  razorpayOrderId?: string;
  deliveryNotes: string;
  fileUrl: string;
}
export interface IJob extends Document {
  client: mongoose.Types.ObjectId;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'active' | 'completed';
  hiredFreelancer?: mongoose.Types.ObjectId;
  createdAt: Date;
  milestones: IMilestone[];
}

const JobSchema: Schema = new Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'active', 'under_review', 'completed'],
    default: 'open'
  },
  deliveryNotes: { type: String },
  fileUrl: { type: String },
  hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  milestones: [{
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'escrow_funded', 'completed', 'released'],
      default: 'pending'
    },
    razorpayOrderId: { type: String },

  }]
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);