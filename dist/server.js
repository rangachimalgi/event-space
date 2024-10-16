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
require("./keepAlive");
// Load environment variables from .env file
dotenv_1.default.config(); // This ensures that process.env.PORT and other variables are loaded
const app = (0, express_1.default)();
// Connect to MongoDB
(0, db_1.default)();
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: '*', // Allows all origins
}));
// Routes
app.use('/api/events', eventRoutes_1.default);
const portEnv = process.env.PORT;
const PORT = portEnv ? parseInt(portEnv, 10) : 5000;
if (isNaN(PORT)) {
    throw new Error('Invalid PORT environment variable');
}
// Start the server using the port from .env
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
