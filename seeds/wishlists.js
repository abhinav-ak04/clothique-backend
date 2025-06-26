import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/connect.js';
import Wishlist from '../models/Wishlist.js';
import wishlistData from './wishlists.json' assert { type: 'json' };

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        await Wishlist.deleteMany();
        await Wishlist.insertMany(wishlistData);
        console.log('✅ Wishlist data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding wishlist:', error);
        process.exit(1);
    }
};

start();
