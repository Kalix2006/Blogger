import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/user.js';

const seed=async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    const Exists=await User.findOne({email:'admin@gmail.com'});
    if(Exists){
      console.log('Admin user already exists!');
      process.exit();
    }

    const salt=await bcrypt.genSalt(10);
    const hashedP=await bcrypt.hash('admin@123',salt);

    await User.create({
      name:'Admin',
      email:'admin@gmail.com',
      password:hashedP,
      role:'admin',
    });

    console.log('Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:',error);
    process.exit(1);
  }
};
seed();