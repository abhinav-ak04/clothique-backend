import dotenv from 'dotenv';
dotenv.config(); // Loads your .env variables like MONGODB_URL

import mongoose from 'mongoose';
import connectDB from '../db/connect.js'; // Connects to MongoDB Atlas

import Product from '../models/Product.js'; // Your Product model
import products from './products.json' assert { type: 'json' }; // Imports the data

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL); // Connect to DB

        await Product.deleteMany(); // Wipe existing products
        await Product.insertMany(products); // Insert all products from the JSON file

        console.log('✅ Products inserted');
        process.exit(0); // Exit the script
    } catch (error) {
        console.error('❌ Error inserting products:', error);
        process.exit(1);
    }
};

start(); // Run the seed logic
