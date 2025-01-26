import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getLocations, firebasePullData } from "../firebaseDB.js";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [markerClicked, setMarkerClicked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const imageList = await firebasePullData(); 
      const locations = getLocations(imageList); 
      setLocations(locations);
    };

    fetchLocations();
  }, []);

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

  useEffect(() => {
    if (currentLocation) {
      setInitialRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [currentLocation]);

  const handleMarkerPress = (location) => {
    setMarkerClicked(true);
    setSelectedLocation(location); 
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

          {locations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              title={loc.title}
              onPress={() => handleMarkerPress(loc)} 
            />
          ))}
        </MapView>
      )}

      {markerClicked && selectedLocation && (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{`You clicked: ${selectedLocation.title}`}</Text>
          <Text style={styles.text}>You clicked the marker!</Text>
          <Image
            source={{ uri: selectedLocation.imageLink || 'default-image-url' }}
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
  blueCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#006ee6",
    borderWidth: 2,
    borderColor: "white",
  },
});

export default MapScreen;
