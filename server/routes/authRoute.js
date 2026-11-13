import express from 'express';
const router=express.Router();
import login from '../controllers/authcontrol.js';

router.post('/login', login);
export default router;