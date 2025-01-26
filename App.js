import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screens/HomeScreen.js';
import CameraScreen from './Screens/CameraScreen.js';
import MapScreen from './Screens/MapScreen.js';
import FeedScreen from './Screens/FeedScreen.js';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Debug" component={HomeScreen} options={{ headerShown: false }}/>
          <Tab.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
          <Tab.Screen name="Camera" component={CameraScreen} options={{ headerShown: false }}/>
          <Tab.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }}/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  
}

