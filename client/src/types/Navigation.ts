// src/types/navigation.ts
export type RootStackParamList = {
    Home: undefined;
    CreateEvent: undefined;
    ViewEvents: undefined;
    EditEvent: { eventId: string };
    EventDetail: { event: EventData };
  };

  export type EventData = {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    date: string;
    time: string;
    hall: string;
  };
  
