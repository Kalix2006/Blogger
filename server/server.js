import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import {fileURLToPath} from 'url';
import pRoute from './routes/pRoute.js';
import authRoute from './routes/authRoute.js';
import adminRoute from './routes/adminRoute.js';
import catRoute from './routes/catRoute.js';
import authorRoute from './routes/authorRoute.js';
import uploadRoute from './routes/uploadRoute.js';

dotenv.config();

import mongooseConnection from './config/db.js';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const uploadDir=path.join(__dirname,'uploads');
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}

const app=express();

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static(uploadDir));

app.use('/api/auth',authRoute);
app.use('/api/posts',pRoute);
app.use('/api/admin',adminRoute);
app.use('/api/categories',catRoute);
app.use('/api/authors',authorRoute);
app.use('/api/upload',uploadRoute);

app.get('/api/health',(req,res)=>{
    res.json({
        sucesss:true,
        msg:'servr running',
        db:'connected'
    });
});

mongooseConnection();

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running ${PORT}`);
});
