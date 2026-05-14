import mongoose, { Schema, Document } from 'mongoose';

const ReviewSchema: Schema = new Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);