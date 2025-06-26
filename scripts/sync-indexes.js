import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/connect.js';
import Product from '../models/Product.js';

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        await Product.syncIndexes();
        console.log('✅ Indexes synced successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to sync indexes:', error);
        process.exit(1);
    }
};

start();
