import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { getLocations, firebasePullData } from "../firebaseDB.js";
import swapImage from '../assets/swap2.png';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [markerClicked, setMarkerClicked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);

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

    const fetchLocations = async () => {
      try {
        const imageList = await firebasePullData();
        const fetchedLocations = getLocations(imageList);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching locations: ", error);
      }
    };

    getLocation();
    fetchLocations();

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
      return () => {
        if (subscription) subscription.remove();
      };
    };

    watchLocation();
  }, []);

  const handleMarkerPress = (location) => {
    if (location) {
      setMarkerClicked(true);
      setSelectedLocation(location);
    } else {
      setMarkerClicked(false);
      setSelectedLocation(null);
    }
  };

  const handleMapPress = () => {
    if (markerClicked) {
      setMarkerClicked(false);
      setSelectedLocation(null);
    }
  };

  useEffect(() => {
    if (locations.length > 0 && currentLocation) {
      const { latitude, longitude } = locations[0]; 
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [locations, currentLocation]); 

  const handleRefreshMap = async () => {
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

  const fetchLocations = async () => {
    try {
      const imageList = await firebasePullData();
      const fetchedLocations = getLocations(imageList);
      setLocations(fetchedLocations);
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

          {locations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              onPress={() => handleMarkerPress(loc)}  // pass the whole location object
            />
          ))}
          {locations.map((point, i) => (
            <Circle
              key={i}
              center={{ latitude: point.latitude, longitude: point.longitude }}
              radius={50} // in meters, adjust to your liking
              strokeColor="rgba(255,0,0,0.0)"
              fillColor="rgba(255, 0, 0, 0.2)"
            />
          ))}
        </MapView>
      )}

      {markerClicked && selectedLocation && (
        <View style={styles.textContainer}>
          <Image
            source={{ uri: selectedLocation.imageLink }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}

      <TouchableOpacity style={styles.imageBackground} onPress={handleRefreshMap}>
        <Text style={styles.refreshText}>Refresh</Text>
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
    backgroundColor: "#006ee6",
    borderWidth: 2,
    borderColor: "white",
  },
  swapImage: {
    width: 50, 
    height: 50,
  },
  refreshText: {
    color: "white", 
    fontSize: 18, 
  },

  imageBackground: {
    position: "absolute",
    top: 50, 
    right: 20, 
    backgroundColor: "black", 
    padding: 10, 
    borderRadius: 10, 
    zIndex: 1,
  },
});

export default MapScreen;
