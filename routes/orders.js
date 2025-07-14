import express from 'express';
import { getAllOrders, placeOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/:userId', getAllOrders);
router.post('/place', placeOrder);

export default router;
