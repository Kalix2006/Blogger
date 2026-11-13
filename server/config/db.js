import mongoose from "mongoose";
import dotenv from 'dotenv';

const mongooseConnection=async()=>{
    try{
        const Mongo_connection=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connection successful: ${Mongo_connection.connection.host}`);
    }
    catch(error){
        console.log(`${error.message}`);
        process.exit(1);
    }
};
export default mongooseConnection;