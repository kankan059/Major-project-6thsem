import { Server, Socket } from 'socket.io';
import Job from '../models/Job.ts'; // Hum message module yahan se hata sakte hain kyuki save API kar raha hai

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join a Specific Job Room (Security Guard Checked)
    socket.on('join_room', async ({ jobId, userId }) => {
      try {
        const job = await Job.findById(jobId);
        
        // Safety Check: Sirf hired freelancer ya client hi room join kar sakein
        if (job && (job.client.toString() === userId || job.hiredFreelancer?.toString() === userId)) {
          socket.join(jobId);
          console.log(`User ${userId} joined room: ${jobId}`);
        }
      } catch (err) {
        console.error('Room handshake matching validation error:', err);
      }
    });

    // Handle Message Sending (FIXED: Pure rapid transmission lookup)
    socket.on('send_message', (savedMessage: any) => {
      // console.log("Frontend se aaya hua database saved dynamic packet:", savedMessage);
      
      // Extraction mapping directly out of the incoming entity
      const jobId = savedMessage.job;

      if (!jobId) {
        console.error('Data Packet Validation Failure: tracking token missing.');
        return;
      }

      // Broadcast the exact pre-saved message directly to everyone in the workspace room channel
      io.to(jobId).emit('receive_message', savedMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};