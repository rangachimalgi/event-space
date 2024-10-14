"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Event_1 = __importDefault(require("../models/Event")); // Ensure the path to your Event model is correct
const router = (0, express_1.Router)();
// POST endpoint to create a new event
router.post('/', async (req, res) => {
    try {
        const { name, email, phoneNumber, date, time, hall } = req.body;
        const newEvent = new Event_1.default({
            name,
            email,
            phoneNumber,
            date: new Date(date), // Convert to Date object if necessary
            time, // Convert to Date object if necessary
            hall
        });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent); // Send back the saved event
    }
    catch (error) {
        res.status(500).json({ error: 'Error saving event' });
    }
});
// GET endpoint to fetch all events
router.get('/', async (req, res) => {
    try {
        const events = await Event_1.default.find(); // Fetch all events from the database
        res.json(events); // Send back the list of events
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});
// PUT endpoint to update an event by its ID
const updateEventHandler = async (req, res) => {
    try {
        const id = req.params.id; // Access ID from parameters
        // Perform the update operation
        const updatedEvent = await Event_1.default.findByIdAndUpdate(id, req.body, { new: true });
        // Handle non-existent event
        if (!updatedEvent) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        // Return the updated event
        res.json(updatedEvent);
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Error updating event' });
    }
};
router.put('/:id', updateEventHandler);
// GET endpoint to fetch a specific event by ID
const getEventHandler = async (req, res) => {
    try {
        const id = req.params.id; // Access ID from parameters
        // Find the event by ID
        const event = await Event_1.default.findById(id);
        // Handle non-existent event
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        // Return the event
        res.json(event);
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Error fetching event' });
    }
};
router.get('/:id', getEventHandler);
exports.default = router;
