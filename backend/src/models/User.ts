import mongoose, { Schema, Document } from 'mongoose';

// User Interface for TS
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'freelancer';
    skills?: string[];
    bio?: string;
    totalReviews : number,
    averageRating: number,
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['client', 'freelancer'],
        required: true
    },
    skills: [{ type: String }],
    bio: { type: String },
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);