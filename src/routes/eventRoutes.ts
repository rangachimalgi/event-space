import { Router } from 'express';
import Event from "../models/Event"

const router = Router();

// POST endpoint to create a new event
router.post('/', async (req, res) => {
  try {
    const { name, email, phoneNumber, date, time, hall } = req.body;

    const newEvent = new Event({
      name,
      email,
      phoneNumber,
      date: new Date(date),   // Convert to Date object if necessary
      time: new Date(time),   // Convert to Date object if necessary
      hall
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);  // Send back the saved event
  } catch (error) {
    res.status(500).json({ error: 'Error saving event' });
  }
});

// GET endpoint to fetch all events
router.get('/', async (req, res) => {
    try {
      const events = await Event.find();  // Fetch all events from the database
      res.json(events);  // Send back the list of events
    } catch (error) {
      res.status(500).json({ error: 'Error fetching events' });
    }
  });

export default router;
