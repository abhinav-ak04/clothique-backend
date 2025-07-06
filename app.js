import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './db/connect.js';

import productRoutes from './routes/products.js';
import cartRoutes from './routes/carts.js';
import wishlistRoutes from './routes/wishlists.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hi, Welcome to the world of Node.js!');
});

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

const start = async () => {
  try {
    // Connecting to the database using the connection string from the environment variables
    // The connection string should be defined in a .env file in the root directory
    await connectDB(process.env.MONGODB_URL); // Connect to the database
    console.log('✅ Connected to MongoDB');

    // Start the server and listen on the specified port
    app.listen(PORT, () => {
      console.log(`🌐 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('❌ Error starting server:', error);
  }
};
start();
