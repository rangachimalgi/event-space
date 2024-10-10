import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import eventRoutes from './routes/eventRoutes';
import connectDB from './config/db';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();  // This ensures that process.env.PORT and other variables are loaded

const app = express();
const port = process.env.PORT || 5000;  // Use the port from the .env file, or default to 5000 if it's not set

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',  // Allows all origins
  }));
// Routes
app.use('/api/events', eventRoutes);

// Start the server using the port from .env
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
