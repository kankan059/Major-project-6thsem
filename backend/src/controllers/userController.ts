import { type Request, type Response } from 'express';
import User from '../models/User.ts';

interface ProfileUpdateBody {
  name: string;
  bio?: string;
  skills?: string[];
}

export const getPublicProfile = async (req: Request<{ userId: string }>, res: Response): Promise<Response> => {
  const { userId } = req.params;

  try {
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: 'Invalid or missing User ID parameter.' });
    }

    // Fixed: Removed the complex .populate() chain that causes the 500 crash
    const userProfile = await (User as any).findById(userId)
      .select('name email role averageRating totalReviews bio skills paymentDetails')
      .exec();

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    // Safe fallback mapper to ensure frontend elements never receive undefined fields
    const safeResponse = {
      _id: userProfile._id,
      name: userProfile.name || '',
      email: userProfile.email || '',
      role: userProfile.role || 'client',
      bio: userProfile.bio || "This user hasn't added a bio yet.",
      skills: userProfile.skills || [], 
      averageRating: userProfile.averageRating || 0,
      totalReviews: userProfile.totalReviews || 0,
      reviews: [], // Temporary safe empty array till you implement a separate Review Schema
      paymentDetails: userProfile.paymentDetails || {
        upiId: '',
        bankName: '',
        accountNumber: '',
        ifscCode: ''
      }
    };

    return res.status(200).json(safeResponse);
  } catch (error: unknown) {
    // Print the exact error log in the backend terminal for monitoring
    console.error("ACTUAL BACKEND QUERY FAULT:", error);
    return res.status(500).json({ message: 'Failed to sync public profile metrics from database server.' });
  }
};

// 2. UPDATE OWN PROFILE PARAMETERS
export const updateOwnProfile = async (req: any, res: Response): Promise<Response> => {
  const { name, bio, skills }: ProfileUpdateBody = req.body;

  try {
    const user = await (User as any).findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User profile session expired.' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;

    await user.save();
    return res.status(200).json({ message: 'Profile variables synchronized successfully.', user });
  } catch (error: unknown) {
    return res.status(500).json({ message: 'Internal server error mutating user record telemetry.' });
  }
};


// Custom interface to authorize req.user structure safely
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface UpdateProfileBody {
  name: string;
  bio: string;
  skills: string[];
  paymentDetails: {
    upiId: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

export const updateProfile = async (req: any, res: Response): Promise<Response | void> => {
  try {
    const userId = req.user.id; // Extracting safe verified user id from token
    const { name, bio, skills, paymentDetails }: UpdateProfileBody = req.body;

    // 1. Find user and update directly inside MongoDB cluster
    const updatedUser = await (User as any).findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          bio,
          skills,
          paymentDetails: {
            upiId: paymentDetails?.upiId || '',
            bankName: paymentDetails?.bankName || '',
            accountNumber: paymentDetails?.accountNumber || '',
            ifscCode: (paymentDetails?.ifscCode || '').toUpperCase()
          }
        }
      },
      { new: true, runValidators: true } // returns the fresh newly updated object
    ).exec();

    if (!updatedUser) {
      return res.status(404).json({ message: 'User record missing.' });
    }

    return res.status(200).json({
      message: 'Profile database records synced and locked successfully.',
      user: updatedUser
    });

  } catch (error: unknown) {
    console.error("Database Update Error:", error);
    return res.status(500).json({ message: 'Internal pipeline fault writing data to cluster.' });
  }
};