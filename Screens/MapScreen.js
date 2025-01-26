import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import getLocations from "../firebaseDB.js";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [markerClicked, setMarkerClicked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    { latitude: 29.648095, longitude: -82.3435861, imageLink: 'https://i.imgur.com/rFBiyeR.jpeg' },
    { latitude: 29.648008346557617, longitude: -82.35013580322266, imageLink: 'https://i.imgur.com/tL80jRS.jpeg'},
    { latitude: 29.649403, longitude: -82.3455544, imageLink: 'https://i.imgur.com/mvDat9q.jpeg'},
  ];

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  // Update this to store the full location object
  const handleMarkerPress = (location) => {
    setMarkerClicked(true);
    setSelectedLocation(location);  // Set the full location object (including imageLink)
  };

  const handleMapPress = () => {
    if (markerClicked) {
      setMarkerClicked(false);
    }
  };

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion} onPress={handleMapPress}>
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
              onPress={() => handleMarkerPress({ title: "Your Location", imageLink: "https://i.imgur.com/lJJZVRv.jpeg" })}
            >
              <View style={styles.blueCircle}></View>
            </Marker>
          )}

          {/* Loop through the locations array and add markers */}
          {locations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={loc.title}
              onPress={() => handleMarkerPress(loc)}  // Pass the whole location object
            />
          ))}
        </MapView>
      )}

      {/* Conditionally render text and image when the marker is clicked */}
      {markerClicked && selectedLocation && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{`You clicked: ${selectedLocation.title}`}</Text>
          <Text style={styles.text}>You clicked the marker!</Text>
          <Image
            source={{ uri: selectedLocation.imageLink }}  // Use the imageLink of the selected location
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    height: 450,
    width: "100%",
  },
  // Custom blue circle for the user's location
  blueCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#006ee6",  // Blue color for the circle
    borderWidth: 2,
    borderColor: "white",  // Optional: white border for visibility
  },
});

export default MapScreen;
