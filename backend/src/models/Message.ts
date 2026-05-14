import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  job: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);