import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MonthPicker from 'react-native-month-year-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation'; // Adjust the path accordingly

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [colorShift] = useState(new Animated.Value(0));

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const onValueChange = (_: any, newDate: Date | undefined) => {
    setShowPicker(false);
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const showPickerModal = () => {
    setShowPicker(true);
  };

  const handleCreateEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const handleViewEvents = () => {
    navigation.navigate('ViewEvents'); // Navigate to the ViewEventsScreen
  };

  const startColorAnimation = () => {
    Animated.loop(
      Animated.timing(colorShift, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  };

  const stopColorAnimation = () => {
    colorShift.stopAnimation(() => {
      colorShift.setValue(0);
    });
  };

  const buttonBorderColor = colorShift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ff00ff', '#00ffff', '#ff00ff'],
  });

  const buttonShadowColor = colorShift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#ff00ff', '#00ffff', '#ff00ff'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showPickerModal}>
        <Text style={styles.dateText}>
          {selectedDate.getFullYear()} {selectedDate.getMonth() + 1}
        </Text>
      </TouchableOpacity>

      <Calendar
        current={selectedDate.toISOString().split('T')[0]}
        minDate={'2020-05-10'}
        maxDate={'2025-05-30'}
        onDayPress={(day: any) => {
          console.log('selected day', day);
        }}
        monthFormat={'yyyy MM'}
        hideArrows={false}
        disableAllTouchEventsForDisabledDays={true}
        renderArrow={(direction: string) => (
          <Text style={styles.arrow}>{direction === 'left' ? '<' : '>'}</Text>
        )}
        hideExtraDays={false}
        disableMonthChange={false}
        hideDayNames={false}
        showWeekNumbers={false}
        onMonthChange={(month: any) => {
          console.log('month changed', month);
        }}
        enableSwipeMonths={true}
        theme={{
          calendarBackground: '#000',
          textSectionTitleColor: '#fff',
          dayTextColor: '#fff',
          todayTextColor: '#00adf5',
          monthTextColor: '#fff',
          arrowColor: '#fff',
        }}
      />

      {showPicker && (
        <MonthPicker
          onChange={onValueChange}
          value={selectedDate}
          minimumDate={new Date(2020, 4)}
          maximumDate={new Date(2025, 4)}
          locale="en"
        />
      )}

      {/* Button for Creating Event */}
      <TouchableOpacity
        onPressIn={startColorAnimation}
        onPressOut={stopColorAnimation}
        onPress={handleCreateEvent}
        style={styles.button}
      >
        <Animated.View
          style={[
            styles.button,
            {
              borderColor: buttonBorderColor,
              shadowColor: buttonShadowColor,
            },
          ]}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Button for Viewing Events */}
      <TouchableOpacity onPress={handleViewEvents} style={styles.button}>
        <Text style={styles.buttonText}>View Events</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Include your existing styles here
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  dateText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
  },
});
