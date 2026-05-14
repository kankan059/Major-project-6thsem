import app from "./src/app.ts";
import http from "http"
import connectDB from "./src/config/db.ts";
import { Server } from "socket.io";
import { setupSocket } from "./src/sockets/socketMain.ts";
const PORT = process.env.PORT || 3000
const server = http.createServer(app);

const io = new Server(server , {
    cors :{
        origin : "*", //after deploy should be the main fronend link
        methods : ['GET' , 'POST'],
    }
});

//connecting with database
connectDB();
//socket event initialize
setupSocket(io);

// Socket Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//connecting with server
server.listen(3000 , ()=>{
    console.log("server is running on ", PORT)
})