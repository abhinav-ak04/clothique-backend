import express from 'express';
import {
  addToWishlist,
  getWishlistItems,
  isInWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController.js';
import { isAuthenticated } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/exists', isAuthenticated, isInWishlist);
router.get('/:userId', isAuthenticated, getWishlistItems);

router.post('/add', isAuthenticated, addToWishlist);

router.delete('/remove-item', isAuthenticated, removeFromWishlist);

export default router;
