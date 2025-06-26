import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './db/connect.js';

const app = express(); // Creating an instance of express
const PORT = process.env.PORT || 8000; // Setting the port to listen on

app.get('/', (req, res) => {
    // Defining the root route
    // This route will respond with a welcome message when accessed
    res.send('Hi, Welcome to the world of Node.js!');
});

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
