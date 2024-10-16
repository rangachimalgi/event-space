import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import eventRoutes from './routes/eventRoutes';
import connectDB from './config/db';
import dotenv from 'dotenv';
import "./keepAlive";

// Load environment variables from .env file
dotenv.config();  // This ensures that process.env.PORT and other variables are loaded

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',  // Allows all origins
  }));
// Routes
app.use('/api/events', eventRoutes);

const portEnv = process.env.PORT;
const PORT: number = portEnv ? parseInt(portEnv, 10) : 5000;

if (isNaN(PORT)) {
  throw new Error('Invalid PORT environment variable');
}

// Start the server using the port from .env

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});