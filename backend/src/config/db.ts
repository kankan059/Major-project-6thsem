import mongoose from "mongoose";
import { error } from "node:console";


async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI || '')
        console.log("database connected succesfully")
    }
    catch(err){
        console.error(`Error : ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
}


export default connectDB;