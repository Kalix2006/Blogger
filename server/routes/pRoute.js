import express from 'express';
const router=express.Router();
import {getP,getPID,createP,updateP,deleteP} from '../controllers/postcontroll.js';
import {protect,admin} from '../middleware/authmiddle.js';

router.get('/',getP);
router.get('/:id',getPID);
router.post('/',protect,admin,createP);
router.put('/:id',protect,admin,updateP);
router.delete('/:id',protect,admin,deleteP);

export default router;
