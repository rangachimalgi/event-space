"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config(); // This ensures that process.env.PORT and other variables are loaded
const app = (0, express_1.default)();
const port = process.env.PORT || 5000; // Use the port from the .env file, or default to 5000 if it's not set
// Connect to MongoDB
(0, db_1.default)();
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/api/events', eventRoutes_1.default);
// Start the server using the port from .env
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
