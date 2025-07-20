import express from 'express';
import {
  addAuthDoc,
  handleLogin,
  handleSignup,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', handleLogin);

router.post('/signup', handleSignup);

router.post('/add-auth-doc', addAuthDoc);

export default router;
