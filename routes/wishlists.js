import express from 'express';
import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/exists', isInWishlist);
router.get('/:userId', getWishlistItems);

router.post('/add', addToWishlist);

router.delete('/remove-item', removeFromWishlist);

export default router;
