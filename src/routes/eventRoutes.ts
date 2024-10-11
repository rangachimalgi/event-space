import { Router, Request, Response, RequestHandler } from 'express';
import Event from '../models/Event'; // Ensure the path to your Event model is correct

const router = Router();

// POST endpoint to create a new event
router.post('/', async (req: Request, res: Response): Promise<void> => {
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

// Define the type for the route parameters
interface Params {
  id: string;
}

// PUT endpoint to update an event by its ID
const updateEventHandler: RequestHandler<Params> = async (req, res): Promise<void> => {
  try {
    const id = req.params.id; // Access ID from parameters

    // Perform the update operation
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

    // Handle non-existent event
    if (!updatedEvent) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Return the updated event
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Error updating event' });
  }
};

router.put('/:id', updateEventHandler);

// GET endpoint to fetch a specific event by ID
const getEventHandler: RequestHandler<{ id: string }> = async (req, res): Promise<void> => {
  try {
    const id = req.params.id; // Access ID from parameters

    // Find the event by ID
    const event = await Event.findById(id);

    // Handle non-existent event
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Return the event
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Error fetching event' });
  }
};

router.get('/:id', getEventHandler);

export default router;
