import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/connect.js';
import Cart from '../models/Cart.js';
import cartData from './carts.json' assert { type: 'json' };

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        await Cart.deleteMany(); // Clear existing
        await Cart.insertMany(cartData);
        console.log('✅ Cart data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding cart:', error);
        process.exit(1);
    }
};

start();
