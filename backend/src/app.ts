import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors"
import authRouter from "./routes/authRouter.ts"
import jobRoutes from './routes/jobRoutes.ts';
import bidRoutes from './routes/bidRoutes.ts';
import messageRoutes from './routes/messageRoutes.ts'
import paymentRoute from "./routes/paymentRoutes.ts"
// import reviewRoutes from "./routes/reviewRoutes.ts";
import userRoutes from "./routes/userRoutes.ts"
import adminRoutes from "./routes/adminRoutes.ts"
dotenv.config();

const app: Application = express();

//middleware
app.use(cors());
app.use(express.json())


app.use("/api/auth" , authRouter);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoute)
// app.use('/api/reviews', reviewRoutes);
app.use('/api/users' , userRoutes )
app.use('/api/admin' , adminRoutes )
export default app