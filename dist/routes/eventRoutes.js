"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Event_1 = __importDefault(require("../models/Event"));
const router = (0, express_1.Router)();
// POST endpoint to create a new event
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phoneNumber, date, time, hall } = req.body;
        const newEvent = new Event_1.default({
            name,
            email,
            phoneNumber,
            date: new Date(date), // Convert to Date object if necessary
            time: new Date(time), // Convert to Date object if necessary
            hall
        });
        const savedEvent = yield newEvent.save();
        res.status(201).json(savedEvent); // Send back the saved event
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving event' });
    }
}));
exports.default = router;
