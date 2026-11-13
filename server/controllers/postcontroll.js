import post from '../models/post.js';

export const createP=async(req,res)=>{
    try{
        const newP=new post(req.body);
        const saveP=await newP.save();
        res.status(201).json(saveP);
    }
    catch(error){
        res.status(400).json({Msg:error.message});
    }
};

export const getP=async(req,res)=>{
    try{
        const allP=await post.find();
        res.status(200).json(allP);
    }
    catch(error){
        res.status(500).json({Msg:error.message});
    }
};

export const getPID=async(req,res)=>{
    try{
        const Pid=await post.findById(req.params.id);
        if(!Pid){
            return res.status(404).json({Msg:'not found'});
        }
        res.status(200).json(Pid);
    }
    catch(error){
        res.status(500).json({Msg:error.message});
    }
};

export const updateP=async(req,res)=>{
    try{
        const upP=await post.findByIdAndUpdate(req.params.id,req.body,
            {new:true,runValidators:true});
            if(!upP){
                return res.status(404).json({Msg:'not found'});
            }
        res.status(200).json(upP);
    }
    catch(error){
        res.status(400).json({Msg:error.message});
    }
};

export const deleteP=async(req,res)=>{
    try{
        const dP=await post.findByIdAndDelete(req.params.id);
            if(!dP){
                return res.status(404).json({Msg:'not found'});
            }
        res.status(200).json({msg:'deleted'});
    }
    catch(error){
        res.status(500).json({Msg:error.message});
    }
};