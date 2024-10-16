"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
function pingServer() {
    https_1.default.get('https://event-space.onrender.com', (res) => {
        console.log('Server pinged with response status code:', res.statusCode);
    }).on('error', (e) => {
        console.error('Error pinging server:', e.message);
    });
}
setInterval(pingServer, 900000);
