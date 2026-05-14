import mongoose, { Schema, Document } from 'mongoose';

export interface IBid extends Document {
  job: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  bidAmount: number;
  proposalText: string;
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
}

const BidSchema: Schema = new Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  proposalText: { type: String, required: true },
  estimatedDays: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
}, { timestamps: true });

// Prevent multiple bids from the same freelancer on the same job
BidSchema.index({ job: 1, freelancer: 1 }, { unique: true });

export default mongoose.model<IBid>('Bid', BidSchema);