import { type Request, type Response } from 'express';
import User from '../models/User.ts';

export const getAllUsersForAdmin = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Fetch all users, populate nested fields, and sort by latest registrations
    const usersDirectory = await User.find()
      .select('name email role averageRating totalReviews reviews')
      .populate({
        path: 'reviews.from',
        select: 'name email' // Target specifically reviewer details
      })
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json(usersDirectory);
  } catch (error: unknown) {
    console.error("ADMIN LEDGER SYSTEM CRASH:", error);
    return res.status(500).json({ message: 'Internal engine fault compiling user directories.' });
  }
};