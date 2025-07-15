import express from 'express';

import { getUserData, updateUserData } from '../controllers/userController.js';

const router = express.Router();

router.get('/get/:userId', getUserData);

router.patch('/update/:userId', updateUserData);

export default router;
