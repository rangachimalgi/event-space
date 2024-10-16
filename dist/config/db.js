"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config(); // This loads the environment variables (like MONGO_URI) from .env
// Directly use the MONGO_URI from the environment file
const mongoURI = process.env.MONGO_URI; // No fallback, assumes MONGO_URI is always set
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(mongoURI); // Use the MongoDB URI from .env file
        console.log('MongoDB Connected');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure if connection fails
    }
};
exports.default = connectDB;
