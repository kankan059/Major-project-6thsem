import { type Response } from 'express';
import Message from '../models/Message.ts';
import Job from '../models/Job.ts';

export const sendMessageAPI = async (req: any, res: Response) => {
  const { jobId, text } = req.body;

  try {
    if (!jobId || !text) {
      return res.status(400).json({ message: 'Validation Error: Job ID and text message are required.' });
    }

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ message: 'Target project workspace not found.' });
    }

    const newMessage = new Message({
      job: jobId,
      sender: req.user.id, // Comes from protect middleware token validation
      text: text.trim()
    });

    await newMessage.save();
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to process and store text payload in MongoDB.' });
  }
};

export const getChatHistory = async (req: any, res: Response) => {
  const { jobId } = req.params;

  try {
    const history = await Message.find({ job: jobId }).sort({ createdAt: 1 });
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to sync historical text streams.' });
  }
};