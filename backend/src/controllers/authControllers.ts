import { type Request, type Response } from 'express';
import User from '../models/User.ts';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id: string , role: string) => {
  return jwt.sign({ id , role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};


interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'freelancer' | 'admin';
}

export const registerUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { name, email, password, role }: RegisterRequestBody = req.body;

  try {
    // 1. Check if email already registered inside cluster
    const userExists = await User.findOne({ email: email.toLowerCase() } as any);
    if (userExists) {
      return res.status(400).json({ message: 'User database record already exists with this email.' });
    }

    // 2. Hash secret pass sequence
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user document with absolute schema fields validation
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      skills: [],
      bio: '',
      totalReviews: 0,
      averageRating: 0, // Explicitly match your standard schema interface
      walletBalance: 0,
      paymentDetails: {
        upiId: '',
        bankName: '',
        accountNumber: '',
        ifscCode: ''
      }
    });

    await newUser.save();

    return res.status(201).json({
      message: 'Account registered cleanly with all initialization fields.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error: unknown) {
    console.error("Signup internal error:", error);
    return res.status(500).json({ message: 'Server error compiling account registration parameters.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email } as any);
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ 
        _id: user._id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id.toString() , user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};