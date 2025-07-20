import express from 'express';

import {
  getUserData,
  isValidUser,
  updateUserData,
} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/get/:userId', isAuthenticated, getUserData);
router.get('/exists', isValidUser);

router.patch('/update/:userId', isAuthenticated, updateUserData);

export default router;
