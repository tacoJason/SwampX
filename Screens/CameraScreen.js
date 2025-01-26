import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  Camera,
} from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import APIKeys from "../APIKeys.js";
import * as Location from "expo-location";
import { firebasePushData } from "../firebaseDB.js";

function CameraScreen() {
  //camera state
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  //page state
  const isFocused = useIsFocused();

  //location states
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  async function useLocationPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);
    console.log(status);
    console.log(locationPermission);
  }

  useEffect(() => {
    useLocationPermissions();
  }, []);

  //prevents rendering page and camera when not focused
  if (!isFocused) {
    return;
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted || locationPermission !== "granted") {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permissions to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
        <Button
          onPress={useLocationPermissions}
          title="Grant Location Permission"
        />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  //takes picture and reformats to readable data
  async function takePicture() {
    console.log("Took Picture");
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo captured:", photo);
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      uploadImage(formData);
    }
  }
  //sends post
  async function uploadImage(formData) {
    try {
      const response = await axios.post(
        "https://api.imgur.com/3/image",
        formData,
        {
          headers: {
            Authorization: `Client-ID ${APIKeys.imgurClientID}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Client Limit:", response.headers["x-ratelimit-clientlimit"]);
      console.log(
        "Client Remaining:",
        response.headers["x-ratelimit-clientremaining"]
      );
      console.log("User Limit:", response.headers["x-ratelimit-userlimit"]);
      console.log(
        "User Remaining:",
        response.headers["x-ratelimit-userremaining"]
      );

      let location = await Location.getCurrentPositionAsync({});
      const longitude = location.coords.longitude;
      const latitude = location.coords.latitude;

      console.log(
        "Upload success!",
        response.data.data.link,
        latitude,
        longitude
      );
      firebasePushData(latitude, longitude, response.data.data.link);
    } catch (error) {
      if (error.response) {
        console.log(
          "Client Limit:",
          error.response.headers["x-ratelimit-clientlimit"]
        );
        console.log(
          "Client Remaining:",
          error.response.headers["x-ratelimit-clientremaining"]
        );
        console.log(
          "User Limit:",
          error.response.headers["x-ratelimit-userlimit"]
        );
        console.log(
          "User Remaining:",
          error.response.headers["x-ratelimit-userremaining"]
        );

        console.error("Error uploading image:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else {
        console.error("Error uploading image:", error.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button1} onPress={toggleCameraFacing}>
            <Image
              source={require("../assets/swap2.png")}
              style={styles.swapImage}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2} onPress={takePicture}>
            <Image
              source={require("../assets/buttonCam.png")}
              style={styles.cameraImage}
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
    margin: 0,
  },
  button1: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: 65,
    margin: 25,
  },
  button2: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 15,
  },
  swapImage: {
    width: 50, // Adjust to desired width
    height: 50, // Adjust to desired height
    resizeMode: "contain", // Ensures the image retains its aspect ratio
  },
  cameraImage: {
    width: 100, // Adjust to desired width
    height: 100, // Adjust to desired height
    resizeMode: "contain", // Ensures the image retains its aspect ratio
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
