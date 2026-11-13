import express from 'express';
const router=express.Router();
import Post from '../models/post.js';
import {protect,admin} from '../middleware/authmiddle.js';

router.get('/posts',protect,admin,async(req,res)=>{
    try{
        const allAdminP=await Post.find().sort({createdAt:-1});
        res.status(200).json({success:true,data:allAdminP});
    }catch(error){
        res.status(500).json({success:false,message:'Server error'});
    }
});

export default router;
