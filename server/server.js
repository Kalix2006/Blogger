import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pRoute from './routes/pRoute.js';
import authRoute from './routes/authRoute.js';
import adminRoute from './routes/adminRoute.js';

dotenv.config();

import mongooseConnection from './config/db.js'

const app=express();

app.use(express.json());
app.use(cors());
app.use('/api/auth',authRoute);
app.use('/api/posts',pRoute);
app.use('/api/admin',adminRoute);

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
