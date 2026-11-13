import express from 'express';
import multer from 'multer';
import path from 'path';
import {protect,admin} from '../middleware/authmiddle.js';

const router=express.Router();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        const ext=path.extname(file.originalname);
        const cleanName=path.basename(file.originalname,ext).replace(/[^a-zA-Z0-9]/g,'-');
        cb(null,`${cleanName}-${Date.now()}${ext}`);
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true);
    }else{
        cb(new Error('Only image files are allowed'),false);
    }
};

const upload=multer({
    storage,
    fileFilter,
    limits:{fileSize:5*1024*1024}
});

router.post('/',protect,admin,upload.single('image'),(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({success:false,message:'Please upload an image file'});
        }
        const fileUrl=`http://localhost:5000/uploads/${req.file.filename}`;
        res.status(200).json({success:true,url:fileUrl,filename:req.file.filename});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
});

export default router;
