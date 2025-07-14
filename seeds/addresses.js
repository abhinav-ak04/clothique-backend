import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../db/connect.js';
import Address from '../models/Address.js';
import addresses from './addresses.json' assert { type: 'json' };

const seedAddresses = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        await Address.deleteMany(); // Clear previous
        await Address.insertMany(addresses);
        console.log('✅ Addresses seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding addresses:', error);
        process.exit(1);
    }
};

seedAddresses();
