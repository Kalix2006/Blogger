import express from 'express';
const router=express.Router();
import {getCats,createCat,deleteCat} from '../controllers/catcontrol.js';
import {protect,admin} from '../middleware/authmiddle.js';

router.get('/',getCats);
router.post('/',protect,admin,createCat);
router.delete('/:id',protect,admin,deleteCat);

export default router;
