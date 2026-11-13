import Post from '../models/post.js';

export const getP=async(req,res)=>{
    try{
        const filter=req.query.all==='true'?{}:{status:'published'};
        const allP=await Post.find(filter).sort({createdAt:-1});
        res.status(200).json({success:true,data:allP});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};

export const getPID=async(req,res)=>{
    try{
        const Pid=await Post.findById(req.params.id);
        if(!Pid){
            return res.status(404).json({success:false,message:'Post not found'});
        }
        res.status(200).json({success:true,data:Pid});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};

export const createP=async(req,res)=>{
    try{
        const newP=await Post.create(req.body);
        res.status(201).json({success:true,data:newP});
    }catch(error){
        res.status(400).json({success:false,message:error.message});
    }
};

export const updateP=async(req,res)=>{
    try{
        const upP=await Post.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!upP){
            return res.status(404).json({success:false,message:'Post not found'});
        }
        res.status(200).json({success:true,data:upP});
    }catch(error){
        res.status(400).json({success:false,message:error.message});
    }
};

export const deleteP=async(req,res)=>{
    try{
        const dP=await Post.findByIdAndDelete(req.params.id);
        if(!dP){
            return res.status(404).json({success:false,message:'Post not found'});
        }
        res.status(200).json({success:true,message:'Post deleted successfully'});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};
