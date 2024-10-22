import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { useFocusEffect } from '@react-navigation/native';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface EventData {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  date: string;
  time: string;
  hall: string;
}

export default function HomeScreen() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Fetch the latest events
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchEvents = async () => {
        try {
          setLoading(true);
          const response = await axios.get('https://event-space.onrender.com/api/events');
          // Sort events by date in descending order
          const sortedEvents = response.data.sort((a: EventData, b: EventData) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          const latestEvents = sortedEvents.slice(0, 5);

          if (isActive) {
            setEvents(latestEvents);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching events:', error);
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchEvents();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handleViewEvents = () => {
    navigation.navigate('ViewEvents');
  };

  const handleEventPress = (event: EventData) => {
    navigation.navigate('EventDetail', { event });
  };

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
        <Text style={styles.loadingText}>Loading Events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Latest Events */}
      <Text style={styles.heading}>Latest Events</Text>
      {events.length === 0 ? (
        <Text style={styles.noEventsText}>No Events Found</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEventPress(item)}>
              <View style={styles.eventItem}>
                <Text style={styles.eventName}>{toCamelCase(item.name)}</Text>
                <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.eventHall}>{item.hall}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Button for Creating Event */}
      <TouchableOpacity onPress={handleCreateEvent} style={styles.button}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>

      {/* Button for Viewing Events */}
      <TouchableOpacity onPress={handleViewEvents} style={styles.button}>
        <Text style={styles.buttonText}>View All Events</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  noEventsText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  eventItem: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  eventName: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 5,
  },
  eventDate: {
    color: '#aaa',
    fontSize: 14,
  },
  eventHall: {
    color: '#aaa',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#665e5e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
