import { StyleSheet, Text, View, StatusBar, Button, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, Camera} from 'expo-camera';
import { useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import imgurClientID from '../APIKeys.js';




function CameraScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null)
  const isFocused = useIsFocused();



  //prevents rendering page and camera when not focused
  if (!isFocused){
    return;
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo captured:', photo);
        const formData = new FormData();
        formData.append('image', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'photo.jpg'
        });

        uploadImage(formData);
    }
  }
  async function uploadImage(formData) {
    try {
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        formData,
        {
          headers: {
            Authorization: `Client-ID ${imgurClientID}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload success!', response.data);


      
    } catch (error) {
      if (error.response) {
        console.error('Error uploading image:', error.response.data);
        console.error('Status Code:', error.response.status);
        console.error('Rate Limit Remaining:', error.response.headers['x-ratelimit-clientremaining']);
      } else {
        console.error('Error uploading image:', error.message);
      }
    }
  }
  

  

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref = {cameraRef} >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
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
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
