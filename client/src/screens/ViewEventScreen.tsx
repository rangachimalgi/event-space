import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, Button } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation'; // Adjust the path accordingly

// Define the Event interface
interface EventData {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  date: string;
  time: string;
  hall: string;
}

type ViewEventsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ViewEvents'>;

export default function ViewEventsScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);

  // State for filters
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterHall, setFilterHall] = useState<string>('');

  // State for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation<ViewEventsScreenNavigationProp>();

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://event-space.onrender.com/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data); // Initially set filtered events to all events
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle filtering when date or hall changes
  useEffect(() => {
    const filterEvents = () => {
      let updatedEvents = events;

      // Filter by date (if provided)
      if (filterDate) {
        updatedEvents = updatedEvents.filter(event => {
          const eventDate = new Date(event.date).toLocaleDateString();
          const selectedDate = filterDate.toLocaleDateString();
          return eventDate === selectedDate;
        });
      }

      // Filter by hall (if provided)
      if (filterHall) {
        updatedEvents = updatedEvents.filter(event =>
          event.hall.toLowerCase().includes(filterHall.toLowerCase())
        );
      }

      setFilteredEvents(updatedEvents);
    };

    filterEvents();
  }, [filterDate, filterHall, events]);

  // Clear filters function
  const clearFilters = () => {
    setFilterDate(undefined);
    setFilterHall('');
    setFilteredEvents(events); // Reset filteredEvents to all events
  };

  const handleEditEvent = (eventId: string) => {
    navigation.navigate('EditEvent', { eventId });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    const currentDate = selectedDate || filterDate;
    setShowDatePicker(Platform.OS === 'ios'); // Close the picker on Android
    setFilterDate(currentDate); // Only set the date if selected
  };

  const handleEventPress = (event: EventData) => {
    navigation.navigate('EventDetail', { event });
  };

  const hallOptions = [
    { label: 'All', value: 'Hall' },
    { label: 'Hall 1', value: 'Hall 1' },
    { label: 'Hall 2', value: 'Hall 2' },
    { label: 'Hall 3', value: 'Hall 3' },
    { label: 'Hall 4', value: 'Hall 4' },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading Events...</Text>
      </View>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Events Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Inputs */}
      <View style={styles.filterContainer}>
        <Button onPress={() => setShowDatePicker(true)} title="Pick a Date" color="#00adf5" />
        {filterDate && <Text style={styles.dateText}>Selected Date: {filterDate.toLocaleDateString()}</Text>}
        {showDatePicker && (
          <DateTimePicker value={filterDate || new Date()} mode="date" display="default" onChange={handleDateChange} />
        )}

        <RNPickerSelect
          onValueChange={(value) => setFilterHall(value)}
          items={hallOptions}
          placeholder={{ label: 'Filter by Hall', value: null }}
          style={pickerSelectStyles}
        />

        {/* Clear Filters Button */}
        <Button title="Clear Filters" color="#ff5c5c" onPress={clearFilters} />
      </View>

      {/* Display Events */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item)}>
            <View style={styles.eventContainer}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text style={styles.eventText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.eventText}>Hall: {item.hall}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  eventContainer: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  eventName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventText: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#00adf5',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 20,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#333',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#333',
    paddingRight: 30,
    marginBottom: 10,
  },
});
