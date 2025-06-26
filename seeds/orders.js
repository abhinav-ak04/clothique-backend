import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/connect.js';
import Order from '../models/Order.js';
import orders from './orders.json' assert { type: 'json' }; // Node.js 18+ feature

const seedOrders = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        await Order.deleteMany(); // Clears existing orders
        await Order.insertMany(orders);
        console.log('✅ Orders seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding orders:', error);
        process.exit(1);
    }
};

seedOrders();
