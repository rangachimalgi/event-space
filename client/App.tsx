import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet } from 'react-native';
import Navbar from './src/components/Navbar';
import HomeScreen from './src/screens/HomeScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import 'react-native-gesture-handler';
import { RootStackParamList } from './src/types/Navigation'; // Import the type
import ViewEventScreen from './src/screens/ViewEventScreen'

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Navbar />
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
          <Stack.Screen name="ViewEvents" component={ViewEventScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default App;
