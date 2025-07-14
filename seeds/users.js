import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/connect.js';
import User from '../models/User.js';
import users from './users.json' assert { type: 'json' };

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        await User.deleteMany(); // Clears existing users
        await User.insertMany(users);
        console.log('✅ Users seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
};

start();
