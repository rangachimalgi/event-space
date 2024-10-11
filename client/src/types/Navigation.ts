// src/types/navigation.ts
export type RootStackParamList = {
    Home: undefined;
    CreateEvent: undefined;
    ViewEvents: undefined;
    EditEvent: { eventId: string };
  };
