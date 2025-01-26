import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  firebasePushData,
  firebasePullData,
  iterateData,
  getLocations,
  getAllBuildings,
} from "../firebaseDB";
import APIKeys from "../APIKeys.js"; // API Keys

function HomeScreen() {
  //test push data
  const handleButtonClick1 = () => {
    firebasePushData("test-latitude", "test-longitude", "test-imageLink");
    console.log("Data pushed to Firebase!");
  };
  //test pull data
  const handleButtonClick2 = async () => {
    const array = await firebasePullData();
    console.log("Data pulled from Firebase!");
    console.log(array);
    console.log(array[0]);
  };

  //test iterating through array
  const handleButtonClick3 = async () => {
    const array = await firebasePullData();
    iterateData(array);
    console.log("Data iterated!");
  };

  //test locations function
  const handleButtonClick4 = async () => {
    const array = await firebasePullData();
    const locations = getLocations(array);
    console.log(locations);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <TouchableOpacity style={styles.button} onPress={handleButtonClick1}>
        <Text style={styles.buttonText}>Push Data to Firebase</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleButtonClick2}>
        <Text style={styles.buttonText}>Pull Data from Firebase</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleButtonClick3}>
        <Text style={styles.buttonText}>Parse Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleButtonClick4}>
        <Text style={styles.buttonText}>Get Locations</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
