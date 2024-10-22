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

  function toCamelCase(str: string) {
    return str
      .toLowerCase() // Set the string to lowercase
      .split(' ') // Split the string by spaces into an array of words
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back into a single string
  }

  return (
    <View style={styles.container}>
      {/* Filter Inputs */}
      <View style={styles.filterContainer}>
        {/* Pick a Date Button */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>PICK A DATE</Text>
        </TouchableOpacity>

        {filterDate && <Text style={styles.dateText}>Selected Date: {filterDate.toLocaleDateString()}</Text>}

        {/* DateTimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={filterDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Hall Picker */}
        <RNPickerSelect
          onValueChange={(value) => setFilterHall(value)}
          items={hallOptions}
          placeholder={{ label: 'FILTER BY HALL', value: null }}
          style={pickerSelectStyles}
        />

        {/* Clear Filters Button */}
        <TouchableOpacity onPress={clearFilters} style={[styles.filterButton, styles.clearButton]}>
          <Text style={styles.filterButtonTextClear}>CLEAR FILTERS</Text>
        </TouchableOpacity>
      </View>

      {/* Table Headers */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>NAME</Text>
        <Text style={styles.headerText}>DATE</Text>
        <Text style={styles.headerText}>HALL</Text>
      </View>

      {/* Display Events */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item)}>
            <View style={styles.tableRow}>
            <Text style={styles.Eventname}>{toCamelCase(item.name)}</Text>
            <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.cell}>{item.hall}</Text>
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
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#000000', // Black background to contrast with white
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5, // Increase elevation for more prominent shadow
    shadowColor: '#fff', // White shadow color
    shadowOffset: { width: 2, height: 4 }, // Make shadow offset larger to create more depth
    shadowOpacity: 0.7, // Increase opacity to make the shadow more visible
    shadowRadius: 6, // Increase radius to blur the shadow and make it more prominent
    borderWidth: 2, // Add white border for more emphasis
    borderColor: '#665e5e', // White border
    alignItems: 'center', // Center the text inside the button
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterButtonTextClear: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#000000',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginBottom: 5,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff25',
  },
  eventName: {
    color: '#fff',
    fontSize: 16,
    flex: 2, // Allow name to take up available space
    marginRight: 10,
  },
  eventInfo: {
    color: '#fff',
    fontSize: 14,
    flex: 1, // Equal space for date and hall
    marginRight: 10, // Adds right margin for spacing
  },
  eventDate: {
    color: '#fff',
    fontSize: 14,
    width: 90, // Fixed width for date
  },
  eventHall: {
    color: '#fff',
    fontSize: 14,
    width: 80, // Fixed width for hall
  },
  eventContainer: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  eventText: {
    color: '#fff',
    fontSize: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center', // Centers text in columns
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
  dateText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff25',
  },
  cell: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'center', // Centers text in columns
  },
  Eventname: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'left', // Centers text in columns
  }
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
    backgroundColor: '#000',
    paddingRight: 30,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#333',
    paddingRight: 30,
    marginTop: 12,
    marginBottom: 12,
  },
});
