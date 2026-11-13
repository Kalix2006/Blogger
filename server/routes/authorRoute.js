import express from 'express';
const router=express.Router();
import {getAuthors,createAuthor,deleteAuthor} from '../controllers/authorcontrol.js';
import {protect,admin} from '../middleware/authmiddle.js';

router.get('/',getAuthors);
router.post('/',protect,admin,createAuthor);
router.delete('/:id',protect,admin,deleteAuthor);

export default router;
