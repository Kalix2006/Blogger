import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login=async(req, res)=>{
  try {
    const{email,password}=req.body;
    if(!email||!password){
      return res.status(400).json({success:false,message:'Please provide both email and password'});
    }
    const user=await User.findOne({email});
    if (!user) {
      return res.status(401).json({success:false,message:'Invalid credentials'});
    }
    const match=await bcrypt.compare(password,user.password);

    if (!match) {
      return res.status(401).json({success:false,message:'Invalid credentials'});
    }

    const token = jwt.sign(
      {id:user._id,role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:'1d'} 
    );
    return res.status(200).json({
      success:true,
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
      },
    });
  }catch(error){
    console.error('Login error:',error);
    return res.status(500).json({success:false,message:'Server error'});
  }
};
export default login;