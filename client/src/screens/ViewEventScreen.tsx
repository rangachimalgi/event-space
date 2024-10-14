import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation'; // Adjust the path accordingly

// Define the Event interface
interface Event {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  date: string; // Use 'string' or 'Date' depending on your data format
  time: string; // Use 'string' or 'Date' depending on your data format
  hall: string;
}

type ViewEventsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ViewEvents'>;

export default function ViewEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<ViewEventsScreenNavigationProp>();

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
          const response = await axios.get('https://sincerely-popular-serval.ngrok-free.app/api/events');
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEditEvent = (eventId: string) => {
    navigation.navigate('EditEvent', { eventId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading Events...</Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No Events Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventText}>Name: {item.name}</Text>
            <Text style={styles.eventText}>Email: {item.email}</Text>
            <Text style={styles.eventText}>Phone: {item.phoneNumber}</Text>
            <Text style={styles.eventText}>
              Date: {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.eventText}>
              Time: {new Date(item.time).toLocaleTimeString()}
            </Text>
            <Text style={styles.eventText}>Hall: {item.hall}</Text>

            {/* Add Edit Button */}
            <TouchableOpacity
              onPress={() => handleEditEvent(item._id)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Include your existing styles here)
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
});
