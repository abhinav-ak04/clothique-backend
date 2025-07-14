import express from 'express';
import {
  searchProducts,
  getProductById,
} from '../controllers/productController.js';

const router = express.Router();

// GET /api/products/search?q=shirt&type=Men&brand=...
router.get('/search', searchProducts);

// GET /api/products/:id
router.get('/:productId', getProductById);

export default router;
