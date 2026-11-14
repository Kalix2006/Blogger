import mongoose from 'mongoose';
import Post from '../models/post.js';

const makeSlug=(txt)=>{
    if(!txt)return '';
    return txt.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g,'')
        .replace(/\s+/g,'-')
        .replace(/-+/g,'-')
        .replace(/^-+|-+$/g,'');
};

export const syncScheduled=async()=>{
    try{
        const curDate=new Date();
        await Post.updateMany(
            {
                status:'scheduled',
                scheduledAt:{$lte:curDate}
            },
            {
                $set:{status:'published'}
            }
        );
    }catch(err){
        console.error('sync error',err);
    }
};

export const getP=async(req,res)=>{
    try{
        await syncScheduled();
        const filter=req.query.all==='true'?{}:{status:'published'};
        if(req.query.category && req.query.category!=='All'){
            filter.category=req.query.category;
        }
        const allP=await Post.find(filter).sort({createdAt:-1});
        res.status(200).json({success:true,data:allP});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
};

export const getPID=async(req,res)=>{
    try{
        await syncScheduled();
        const paramId=req.params.id;
        let Pid=null;
        if(mongoose.Types.ObjectId.isValid(paramId)){
            Pid=await Post.findOne({$or:[{_id:paramId},{slug:paramId}]});
        }else{
            Pid=await Post.findOne({slug:paramId});
        }
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
        const bodyObj={...req.body};
        if(!bodyObj.slug&&bodyObj.title){
            let genSlug=makeSlug(bodyObj.title);
            const exists=await Post.findOne({slug:genSlug});
            if(exists){
                genSlug=`${genSlug}-${Date.now().toString().slice(-4)}`;
            }
            bodyObj.slug=genSlug;
        }
        if(Array.isArray(bodyObj.tags)){
            bodyObj.tags=bodyObj.tags.map((t)=>t.trim()).filter(Boolean);
        }else if(typeof bodyObj.tags==='string'){
            bodyObj.tags=bodyObj.tags.split(',').map((t)=>t.trim()).filter(Boolean);
        }
        if(bodyObj.status==='scheduled'&&bodyObj.scheduledAt){
            const sDate=new Date(bodyObj.scheduledAt);
            if(sDate<=new Date()){
                bodyObj.status='published';
            }else{
                bodyObj.scheduledAt=sDate;
            }
        }
        const newP=await Post.create(bodyObj);
        res.status(201).json({success:true,data:newP});
    }catch(error){
        res.status(400).json({success:false,message:error.message});
    }
};

export const updateP=async(req,res)=>{
    try{
        const bodyObj={...req.body};
        if(bodyObj.slug){
            bodyObj.slug=makeSlug(bodyObj.slug);
        }
        if(Array.isArray(bodyObj.tags)){
            bodyObj.tags=bodyObj.tags.map((t)=>t.trim()).filter(Boolean);
        }else if(typeof bodyObj.tags==='string'){
            bodyObj.tags=bodyObj.tags.split(',').map((t)=>t.trim()).filter(Boolean);
        }
        if(bodyObj.status==='scheduled'&&bodyObj.scheduledAt){
            const sDate=new Date(bodyObj.scheduledAt);
            if(sDate<=new Date()){
                bodyObj.status='published';
            }else{
                bodyObj.scheduledAt=sDate;
            }
        }
        const upP=await Post.findByIdAndUpdate(req.params.id,bodyObj,{
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
