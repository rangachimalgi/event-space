import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for your event
interface IEvent extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  date: Date;
  time: Date;
  hall: string;
}

// Create a schema for the event
const eventSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: Date, required: true },
  hall: { type: String, required: true }
});

// Create a Mongoose model for the event and export it
const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
