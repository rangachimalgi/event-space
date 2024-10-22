import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function EventDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();
  const { event } = route.params;

  const [eventData, setEventData] = useState(event);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchEvent = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`https://event-space.onrender.com/api/events/${event._id}`);
          if (isActive) {
            setEventData(response.data);
          }
        } catch (error) {
          console.error('Error fetching event details:', error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchEvent();

      return () => {
        isActive = false;
      };
    }, [event._id])
  );

  if (loading || !eventData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{eventData.name}</Text>
      <Text style={styles.eventText}>Email: {eventData.email}</Text>
      <Text style={styles.eventText}>Phone: {eventData.phoneNumber}</Text>
      <Text style={styles.eventText}>Date: {new Date(eventData.date).toLocaleDateString()}</Text>
      <Text style={styles.eventText}>Time: {new Date(eventData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text style={styles.eventText}>Hall: {eventData.hall}</Text>

      {/* Edit Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditEvent', { eventId: eventData._id })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  eventName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
  },
  editButton: {
    backgroundColor: '#00adf5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
