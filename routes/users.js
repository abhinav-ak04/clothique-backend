import express from 'express';

import { getUserData, updateUserData } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/get/:userId', isAuthenticated, getUserData);

router.patch('/update/:userId', isAuthenticated, updateUserData);

export default router;
