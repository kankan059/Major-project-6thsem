import express, { type Application } from "express";
import dotenv from "dotenv";
import cors from "cors"
import authRouter from "./routes/authRouter.ts"
import jobRoutes from './routes/jobRoutes.ts';
import bidRoutes from './routes/bidRoutes.ts';
dotenv.config();

const app: Application = express();

//middleware
app.use(cors());
app.use(express.json())


app.use("/api/auth" , authRouter);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);

export default app