import express from 'express';
const router = express.Router();
import Post from '../models/post.js';
import {protect,admin} from '../middleware/authmiddle.js';

router.get('/',async(req,res)=>{
  try {
    const posts=await Post.find({});
    res.status(200).json({success:true,data:posts});
  } catch (error) {
    res.status(500).json({success:false,message:'Server error'});
  }
});

router.get('/:id',async(req,res)=>{
  try {
    const post=await Post.findOne({ _id:req.params.id,status:'published'});
    
    if(!post){
      return res.status(404).json({success:false,message:'Post not found'});
    }
    
    res.status(200).json({success: true,data:post});
  }catch (error) {
    res.status(500).json({success:false,message:'Server error'});
  }
});

router.post('/',protect,admin,async(req,res)=>{
  try{
    const newP=await Post.create(req.body);
    res.status(201).json({success:true,data:newP});
  } catch (error) {
    res.status(400).json({success:false,message:error.message});
  }
});

router.put('/:id',protect,admin,async(req,res)=>{
  try{
    const updatedP=await Post.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true,
    });
    
    if(!updatedP) {
      return res.status(404).json({success:false,message:'Post not found'});
    }
    
    res.status(200).json({success:true,data:updatedP});
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id',protect,admin,async(req,res)=>{
  try {
    const deleteP=await Post.findByIdAndDelete(req.params.id);
    
    if(!deleteP) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.status(200).json({success:true,message:'Post deleted successfully'});
  }catch (error) {
    res.status(500).json({success:false,message:'Server error'});
  }
});
export default router;