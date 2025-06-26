// Description: This file contains the database connection logic using Mongoose.
// It exports a function that connects to the MongoDB database using the provided URI.

import mongoose from 'mongoose'; // Importing mongoose library

const connectDB = (uri) => {
    // Function to connect to the MongoDB database using Mongoose
    // Takes a URI as an argument
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default connectDB; // Exporting the connectDB function for use in other files
