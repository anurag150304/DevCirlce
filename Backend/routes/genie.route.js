import express from 'express';
import userAuth from '../middlewares/user.auth.js';
import * as genieController from '../controllers/genie.controller.js';
import { query } from 'express-validator';

const router = express.Router();

router.get('/get-result', userAuth,
    query('prompt').isString().notEmpty().withMessage('Prompt is required'),
    genieController.generateContent);

export default router;