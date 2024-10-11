import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

// Define the event interface
interface Event {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    date: string;
    time: string;
    hall: string;
}

export default function EditEventScreen({ route, navigation }: any) {
    const { eventId } = route.params; // Get the event ID from the route params

    const [event, setEvent] = useState<Event | null>(null); // Store the event data
    const [loading, setLoading] = useState(true);

    // Fetch event details when the screen loads
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://192.168.29.122:5000/api/events/${eventId}`);
                setEvent(response.data); // Set the event data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event details:', error);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    // Handle form submission
    const handleSubmit = async () => {
        if (!event) return;

        try {
            await axios.put(`http://192.168.29.122:5000/api/events/${eventId}`, event);  // PUT request to update the event
            Alert.alert('Success', 'Event updated successfully!');
            navigation.goBack();  // Go back to the previous screen
        } catch (error) {
            console.error('Error updating event:', error);
            Alert.alert('Error', 'Could not update the event.');
        }
    };

    if (loading || !event) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Loading event details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Edit Event</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={event.name}
                onChangeText={(text) => setEvent({ ...event, name: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={event.email}
                onChangeText={(text) => setEvent({ ...event, email: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={event.phoneNumber}
                onChangeText={(text) => setEvent({ ...event, phoneNumber: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Date"
                value={event.date}
                onChangeText={(text) => setEvent({ ...event, date: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Time"
                value={event.time}
                onChangeText={(text) => setEvent({ ...event, time: text })}
            />

            <TextInput
                style={styles.input}
                placeholder="Hall"
                value={event.hall}
                onChangeText={(text) => setEvent({ ...event, hall: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Update Event</Text>
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
    heading: {
        color: '#fff',
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#1c1c1c',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 18,
    },
    button: {
        backgroundColor: '#00adf5',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
