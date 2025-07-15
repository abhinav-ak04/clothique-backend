import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';

import connectDB from './db/connect.js';

import addressRoutes from './routes/addresses.js';
import cartRoutes from './routes/carts.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import wishlistRoutes from './routes/wishlists.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// ✅ Simplified CORS: allow all origins (for now)
app.use(cors({ origin: '*' }));

// Optional: handle preflight requests (especially useful for DELETE/PUT/POST)
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Hi, Welcome to the world of Node.js!');
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/user', userRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🌐 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('❌ Error starting server:', error);
  }
};

start();
