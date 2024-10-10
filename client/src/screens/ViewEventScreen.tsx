import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

// Define the Event interface
interface Event {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  date: string;  // You can use 'Date' type if you're converting it to a Date object
  time: string;  // You can use 'Date' type if you're converting it to a Date object
  hall: string;
}

export default function ViewEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]); // Use Event[] to type the events array
  const [loading, setLoading] = useState(true); // State to handle loading state

  // Fetch events from the backend when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://192.168.29.122:5000/api/events'); // Replace with your backend URL
        setEvents(response.data); // Set the fetched events
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchEvents();
  }, []);

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
        keyExtractor={(item) => item._id} // Assuming MongoDB generates _id for each event
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventText}>Name: {item.name}</Text>
            <Text style={styles.eventText}>Email: {item.email}</Text>
            <Text style={styles.eventText}>Phone: {item.phoneNumber}</Text>
            <Text style={styles.eventText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.eventText}>Time: {new Date(item.time).toLocaleTimeString()}</Text>
            <Text style={styles.eventText}>Hall: {item.hall}</Text>
          </View>
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
  eventText: {
    color: '#fff',
    fontSize: 16,
  },
});
