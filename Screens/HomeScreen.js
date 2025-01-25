import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { firebasePushData } from '../firebaseDB';

function HomeScreen() {

  const handleButtonClick = () => {
    firebasePushData('test-longitude', 'test-latitude', 'test-imageLink');
    console.log('Data pushed to Firebase!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
        <Text style={styles.buttonText}>Push Data to Firebase</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
