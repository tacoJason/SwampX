import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { getLocations, firebasePullData } from "../firebaseDB.js";

// Import the image
import swapImage from '../assets/swap2.png';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [markerClicked, setMarkerClicked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]); // State to hold the fetched locations from Firebase

  useEffect(() => {
    // Request for location permission and get current location
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

    // Fetch locations from Firebase and update state
    const fetchLocations = async () => {
      try {
        const imageList = await firebasePullData(); // Get data from Firebase
        const fetchedLocations = getLocations(imageList); // Process and map the data into a location array
        setLocations(fetchedLocations); // Update state with fetched locations
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    getLocation();
    fetchLocations();

    // Automatic location watching (Optional)
    const watchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation },
        (newLocation) => {
          setCurrentLocation(newLocation.coords);
          setInitialRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );

      // Clean up when component unmounts
      return () => {
        if (subscription) subscription.remove();
      };
    };

    watchLocation();
  }, []);

  // Handle marker press to show details
  const handleMarkerPress = (location) => {
    if (location) {
      setMarkerClicked(true);
      setSelectedLocation(location);
    } else {
      setMarkerClicked(false);
      setSelectedLocation(null);
    }
  };

  // Handle map press to reset marker details
  const handleMapPress = () => {
    if (markerClicked) {
      setMarkerClicked(false);
      setSelectedLocation(null);
    }
  };

  // Fetch locations and set initial region when the locations state changes
  useEffect(() => {
    if (locations.length > 0 && currentLocation) {
      const { latitude, longitude } = locations[0]; // Use the first location's coordinates
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [locations, currentLocation]); // Run this effect whenever locations or currentLocation changes

  // Refresh function triggered by the image press
  const handleRefreshMap = async () => {
    // Refresh the current location
    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
    setInitialRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    // Fetch new locations
    await fetchLocations();
  };

  // Fetch new locations from Firebase
  const fetchLocations = async () => {
    try {
      const imageList = await firebasePullData();
      const fetchedLocations = getLocations(imageList);
      setLocations(fetchedLocations); // Update locations state
    } catch (error) {
      console.error("Error fetching locations: ", error);
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
              onPress={() => handleMarkerPress(loc)}  // Pass the whole location object
            />
          ))}
          {locations.map((point, i) => (
            <Circle
              key={i}
              center={{ latitude: point.latitude, longitude: point.longitude }}
              radius={50} // in meters, adjust to your liking
              strokeColor="rgba(255,0,0,0.0)" // no stroke
              fillColor="rgba(255, 0, 0, 0.2)" // translucent red
            />
          ))}
        </MapView>
      )}

      {/* Conditionally render text and image when the marker is clicked */}
      {markerClicked && selectedLocation && (
        <View style={styles.textContainer}>
          <Image
            source={{ uri: selectedLocation.imageLink }}  // Use the imageLink of the selected location
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Add a black background behind the image */}
      <TouchableOpacity style={styles.imageBackground} onPress={handleRefreshMap}>
        <Image
          source={swapImage}
          style={styles.swapImage}
        />
      </TouchableOpacity>
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
    bottom: 150,
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
  blueCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#006ee6",  // Blue color for the circle
    borderWidth: 2,
    borderColor: "white",
  },
  swapImage: {
    width: 50,  // Set size of the image
    height: 50, // Set size of the image
  },
  imageBackground: {
    position: "absolute",
    top: 50, // Adjust the distance from top
    right: 20, // Position from the right
    backgroundColor: "black", // Black background behind the image
    padding: 10, // Add padding for spacing
    borderRadius: 10, // Optional: rounded corners for the background box
    zIndex: 1, // Ensure the image is above the map
  },
});

export default MapScreen;
