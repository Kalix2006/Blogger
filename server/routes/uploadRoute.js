import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import {protect,admin} from '../middleware/authmiddle.js';

const router=express.Router();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const uploadDir=path.join(__dirname,'..','uploads');

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir,{recursive:true});
        }
        cb(null,uploadDir);
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

router.post('/',protect,admin,(req,res)=>{
    upload.single('image')(req,res,(err)=>{
        if(err){
            return res.status(400).json({success:false,message:err.message});
        }
        if(!req.file){
            return res.status(400).json({success:false,message:'Please upload an image file'});
        }
        const proto=req.headers['x-forwarded-proto']||req.protocol;
        const hostUrl=req.get('host');
        const fileUrl=`${proto}://${hostUrl}/uploads/${req.file.filename}`;
        res.status(200).json({success:true,url:fileUrl,filename:req.file.filename});
    });
});

export default router;
