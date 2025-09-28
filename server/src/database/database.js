const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables. Please add it to your .env file.");
}

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection.");
        return;
    }

    try {
        const db = await mongoose.connect(MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;