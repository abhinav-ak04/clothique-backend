import express from 'express';
import {
  addToCart,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';
import { isAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/:userId', isAuthenticated, getCartItems);

router.post('/add', isAuthenticated, addToCart);

router.patch('/update', isAuthenticated, updateCartItem);

router.delete('/remove-item', isAuthenticated, removeCartItem);
router.delete('/clear/:userId', isAuthenticated, clearCart);

export default router;
