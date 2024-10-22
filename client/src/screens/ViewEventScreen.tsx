import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Alert,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';

interface EventData {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  date: string;
  time: string;
  hall: string;
}

type ViewEventsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ViewEvents'
>;

export default function ViewEventsScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);

  // State for filters
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterHall, setFilterHall] = useState<string>('');

  // State for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<ViewEventsScreenNavigationProp>();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        'https://event-space.onrender.com/api/events'
      );
      setEvents(response.data);
      setFilteredEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = async () => {
    console.log('Pull-to-refresh triggered');
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  // Handle filtering when date or hall changes
  useEffect(() => {
    const filterEvents = () => {
      let updatedEvents = events;

      // Filter by date (if provided)
      if (filterDate) {
        updatedEvents = updatedEvents.filter((event) => {
          const eventDate = new Date(event.date).toLocaleDateString();
          const selectedDate = filterDate.toLocaleDateString();
          return eventDate === selectedDate;
        });
      }

      // Filter by hall (if provided)
      if (filterHall) {
        updatedEvents = updatedEvents.filter((event) =>
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

  // Delete event function
  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete event from server
              await axios.delete(
                `https://event-space.onrender.com/api/events/${eventId}`
              );
              // Update local state
              setEvents((prevEvents) =>
                prevEvents.filter((event) => event._id !== eventId)
              );
              setFilteredEvents((prevEvents) =>
                prevEvents.filter((event) => event._id !== eventId)
              );
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert(
                'Error',
                'Failed to delete the event. Please try again.'
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const hallOptions = [
    { label: 'All', value: '' },
    { label: 'Hall 1', value: 'Hall 1' },
    { label: 'Hall 2', value: 'Hall 2' },
    { label: 'Hall 3', value: 'Hall 3' },
    { label: 'Hall 4', value: 'Hall 4' },
  ];

  function toCamelCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading Events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Inputs */}
      <View style={styles.filterContainer}>
        {/* Pick a Date Button */}
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.filterButton}
        >
          <Text style={styles.filterButtonText}>PICK A DATE</Text>
        </TouchableOpacity>

        {filterDate && (
          <Text style={styles.dateText}>
            Selected Date: {filterDate.toLocaleDateString()}
          </Text>
        )}

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
          placeholder={{ label: 'FILTER BY HALL', value: '' }}
          style={pickerSelectStyles}
        />

        {/* Clear Filters Button */}
        <TouchableOpacity
          onPress={clearFilters}
          style={[styles.filterButton, styles.clearButton]}
        >
          <Text style={styles.filterButtonTextClear}>CLEAR FILTERS</Text>
        </TouchableOpacity>
      </View>

      {/* Table Headers */}
      <View style={styles.tableHeader}>
        <Text style={styles.nameHeaderText}>NAME</Text>
        <Text style={styles.headerText}>DATE</Text>
        <Text style={styles.headerText}>HALL</Text>
        <Text style={styles.headerText}>ACTION</Text>
      </View>

      {/* Display Events */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <TouchableOpacity
              onPress={() => handleEventPress(item)}
              style={styles.nameCell}
            >
              <Text style={styles.Eventname}>{toCamelCase(item.name)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleEventPress(item)}
              style={styles.cell}
            >
              <Text style={styles.cellText}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleEventPress(item)}
              style={styles.cell}
            >
              <Text style={styles.cellText}>{item.hall}</Text>
            </TouchableOpacity>
            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleDeleteEvent(item._id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.text}>No Events Found</Text>
          </View>
        }
        overScrollMode="always"
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
  emptyContainer: {
    flex: 1, // Center the empty component
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#fff',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#665e5e',
    alignItems: 'center',
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
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff25',
  },
  nameHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1.5,
    textAlign: 'left',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  nameCell: {
    flex: 1.5,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  cellText: {
    color: '#fff',
    fontSize: 14,
  },
  Eventname: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'left',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
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
