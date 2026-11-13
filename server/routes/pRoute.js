import express from 'express';
import {
    createP, getP, getPID, updateP, deleteP
} from '../controllers/postcontroll.js';

const router=express.Router();

router.route('/').get(getP).post(createP);

router.route('/:id').get(getPID).put(updateP).delete(deleteP);

export default router;