import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { useNavigation } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function EventDetailScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'EventDetail'>>();
    const { event } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventText}>Email: {event.email}</Text>
      <Text style={styles.eventText}>Phone: {event.phoneNumber}</Text>
      <Text style={styles.eventText}>Date: {new Date(event.date).toLocaleDateString()}</Text>
      <Text style={styles.eventText}>Time: {new Date(event.time).toLocaleTimeString()}</Text>
      <Text style={styles.eventText}>Hall: {event.hall}</Text>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditEvent', { eventId: event._id })}>
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
});
