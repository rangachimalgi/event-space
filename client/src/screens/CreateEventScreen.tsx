import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // For dropdowns
import { Alert } from 'react-native';

export default function CreateEventScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedHall, setSelectedHall] = useState('Hall 1');

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date; // Use selectedDate if it's not undefined, otherwise use current date state
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };
  
  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || time; // Use selectedTime if it's not undefined, otherwise use current time state
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleSubmit = () => {
    console.log('Event Details:', { name, email, phoneNumber, date, time, selectedHall });
    // Display the alert dialog
    Alert.alert(
      "Event Created", // Title of the alert
      "Your event has been successfully created!", // Message showing in the alert
      [
        {
          text: "OK",
          onPress: () => {
            console.log("OK Pressed");
            // Reset the form fields here
            setName('');
            setEmail('');
            setPhoneNumber('');
            setDate(new Date());
            setTime(new Date());
            setSelectedHall('Hall 1');
          }
        } // Button to dismiss the alert and reset the form
      ]
    );
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <View style={styles.pickerContainer}>
        {/* Calendar Picker */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.pickerText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {/* Time Picker */}
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePicker}>
          <Text style={styles.pickerText}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Hall Picker */}
      <View style={styles.hallPicker}>
        <Picker
          selectedValue={selectedHall}
          onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedHall(itemValue)}
          style={{ color: '#fff' }}
        >
          <Picker.Item label="Hall 1" value="Hall 1" />
          <Picker.Item label="Hall 2" value="Hall 2" />
          <Picker.Item label="Hall 3" value="Hall 3" />
          <Picker.Item label="Hall 4" value="Hall 4" />
        </Picker>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  datePicker: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timePicker: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerText: {
    color: '#fff',
    fontSize: 18,
  },
  hallPicker: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    marginBottom: 15,
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
