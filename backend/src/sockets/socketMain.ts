import { Server, Socket } from 'socket.io';
import Message from '../models/Message.ts';
import Job from '../models/Job.ts';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    //  Join a Specific Job Room
    socket.on('join_room', async ({ jobId, userId }) => {
      const job = await Job.findById(jobId);
      
      // Safety Check: Sirf hired freelancer ya client hi room join kar sakein
      if (job && (job.client.toString() === userId || job.hiredFreelancer?.toString() === userId)) {
        socket.join(jobId);
        console.log(`User ${userId} joined room: ${jobId}`);
      }
    });

    //  Handle Message Sending
    socket.on('send_message', async (data) => {
      const { jobId, senderId, text } = data;

      // Save message to DB
      const newMessage = await Message.create({
        job: jobId,
        sender: senderId,
        text: text
      });

      // Broadcast to everyone in the room
      io.to(jobId).emit('receive_message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};