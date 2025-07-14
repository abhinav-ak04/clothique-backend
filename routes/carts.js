import express from 'express';
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCartItems);

router.post('/add', addToCart);

router.patch('/update', updateCartItem);

router.delete('/remove-item', removeCartItem);
router.delete('/clear/:userId', clearCart);

export default router;
