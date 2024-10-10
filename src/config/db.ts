import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();  // This loads the environment variables (like MONGO_URI) from .env

// Directly use the MONGO_URI from the environment file
const mongoURI = process.env.MONGO_URI as string;  // No fallback, assumes MONGO_URI is always set

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);  // Use the MongoDB URI from .env file
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process with failure if connection fails
  }
};

export default connectDB;
