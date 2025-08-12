// db.js (or the name of your file)

const mongoose = require('mongoose');

/**
 * @function connectDb
 * @description Establishes a connection to the MongoDB database using Mongoose.
 * This function relies on the MONGODB_URL environment variable.
 */
const connectDb = async () => {
    try {
        // Use the standard uppercase convention for environment variables.
        // The URL should be defined in your .env file.
        const dbUrl = process.env.MONGODB_URL;

        // Check if the environment variable exists.
        if (!dbUrl) {
            // Throw an error if the URL is not found, which will be caught below.
            throw new Error('MONGODB_URL is not defined in the environment variables.');
        }

        // Connect to the database. The 'await' pauses execution until the promise resolves.
        await mongoose.connect(dbUrl);

        // A simple console log to confirm a successful connection.
        console.log("Database Connected Successfully");

    } catch (error) {
        // This block will catch any errors that occur during the connection process.
        console.error("Database Connection Failed:", error.message);

        // It's a good practice to exit the Node.js process if the database
        // connection fails, as the application cannot function without it.
        process.exit(1);
    }
};

// Export the function to be used in other files, like server.js.
module.exports = connectDb;