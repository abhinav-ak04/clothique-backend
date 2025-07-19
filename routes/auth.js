import express from 'express';
import { handleLogin, handleSignup } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', handleLogin);

router.post('/signup', handleSignup);

export default router;
