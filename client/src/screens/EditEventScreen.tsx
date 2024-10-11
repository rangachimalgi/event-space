import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

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
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [timePickerVisible, setTimePickerVisible] = useState(false);


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
            // Exclude the '_id' field from the event data
            const { _id, ...eventData } = event;

            // Optionally, log the data being sent
            console.log('Updating event with data:', eventData);

            await axios.put(
                `http://192.168.29.122:5000/api/events/${eventId}`,
                eventData
            );

            Alert.alert('Success', 'Event updated successfully!');
            navigation.goBack();
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
    const parseTimeString = (timeString: string): Date => {
        // Handle different time formats
        const [hoursStr, minutesStr] = timeString.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if (isNaN(hours) || isNaN(minutes)) {
            // Default to current time if parsing fails
            return new Date();
        }

        const time = new Date();
        time.setHours(hours);
        time.setMinutes(minutes);
        time.setSeconds(0);
        time.setMilliseconds(0);
        return time;
    };



    const handleDateChange = (eventData: any, selectedDate?: Date) => {
        setDatePickerVisible(Platform.OS === 'ios'); // Keep picker open on iOS
        if (selectedDate) {
            const dateString = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            setEvent({ ...event, date: dateString });
        }
    };

    const handleTimeChange = (eventData: any, selectedTime?: Date) => {
        if (Platform.OS !== 'ios') {
            setTimePickerVisible(false); // Close the picker on Android
        }
        if (selectedTime) {
            const hours = selectedTime.getHours().toString().padStart(2, '0');
            const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`; // Format time as HH:MM
            setEvent({ ...event, time: timeString });
        }
    };



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

            {/* Date Picker */}
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Date"
                    value={event.date}
                    editable={false}
                />
            </TouchableOpacity>
            {datePickerVisible && (
                <DateTimePicker
                    value={new Date(event.date)}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
            {/* Time Picker */}
            <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Time"
                    value={event.time}
                    editable={false}
                />
            </TouchableOpacity>
            {timePickerVisible && (
                <DateTimePicker
                    value={parseTimeString(event.time)}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}

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
