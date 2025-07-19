import express from 'express';
import { getAllOrders, placeOrder } from '../controllers/orderController.js';
import { isAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/:userId', isAuthenticated, getAllOrders);
router.post('/place', isAuthenticated, placeOrder);

export default router;
