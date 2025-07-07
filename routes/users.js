import express from 'express';

import { getUserData, updateUserData } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getUserData);

router.patch('/:userId', updateUserData);

export default router;
