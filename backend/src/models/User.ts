import mongoose, { Schema, Document } from 'mongoose';

// User Interface for TS
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'freelancer' | 'admin';
    skills?: string[];
    bio?: string;
    totalReviews: number;
    averageRating: number;
    walletBalance: number;
    paymentDetails: {
        upiId: string;
        bankName: string;
        accountNumber: string;
        ifscCode: string;
    };
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['client', 'freelancer', 'admin'],
        required: true
    },
    skills: [{ type: String }],
    bio: { type: String },
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviews: [
        {
            from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, required: true },
            comment: { type: String, default: '' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    walletBalance: { type: Number, default: 0 },
    paymentDetails: {
        upiId: { type: String, default: '' },
        bankName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        ifscCode: { type: String, default: '' }
    }
}, { timestamps: true });

// Next.js/Node hot-reload safety switch
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);