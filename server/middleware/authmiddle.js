import jwt from 'jsonwebtoken';

export const protect=(req,res,next)=>{
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try{
      token=req.headers.authorization.split(' ')[1];
      const decode=jwt.verify(token,process.env.JWT_SECRET);
      req.user=decode;
      next();
    } catch (error) {
      console.error('Token verification failed:',error.message);
      return res.status(401).json({success:false,message:'Not authorized,token failed'});
    }
  }
  if (!token) {
    return res.status(401).json({success:false,message:'Not authorized,no token'});
  }
};

export const admin=(req,res,next)=>{
  if(req.user && req.user.role==='admin'){
    next();
  } else {
    return res.status(403).json({success:false,message:'Not authorized as an admin'});
  }
};

