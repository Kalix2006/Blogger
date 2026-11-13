import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pRoute from './routes/pRoute.js';

dotenv.config();

import mongooseConnection from './config/db.js'

const app=express();

app.use(express.json());
app.use(cors());
app.use('/api/posts',pRoute);

app.get('/api/health',(req,res)=>{
    res.json({
        sucesss:true,
        msg:'servr running',
        db: 'connected'
    });
});

mongooseConnection();

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running ${PORT}`);
});
