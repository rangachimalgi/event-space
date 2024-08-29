import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import MonthPicker from 'react-native-month-year-picker';

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onValueChange = (_: any, newDate: Date | undefined) => {
    setShowPicker(false);
    if (newDate) {
        setSelectedDate(newDate);
    }
  };

  const showPickerModal = () => {
    setShowPicker(true);
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <TouchableOpacity onPress={showPickerModal}>
        <Text style={{ fontSize: 24, textAlign: 'center' }}>
          {selectedDate.getFullYear()} {selectedDate.getMonth() + 1}
        </Text>
      </TouchableOpacity>

      <Calendar
        current={selectedDate}
        minDate={'2020-05-10'}
        maxDate={'2025-05-30'}
        onDayPress={(day: any) => {
          console.log('selected day', day);
        }}
        monthFormat={'yyyy MM'}
        hideArrows={false}
        disableAllTouchEventsForDisabledDays={true}
        renderArrow={(direction: string) => (
          <Text>{direction === 'left' ? '<' : '>'}</Text>
        )}
        hideExtraDays={false}
        disableMonthChange={false}
        hideDayNames={false}
        showWeekNumbers={false}
        onMonthChange={(month: any) => {
          console.log('month changed', month);
        }}
        enableSwipeMonths={true}
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
    </View>
  );
}
