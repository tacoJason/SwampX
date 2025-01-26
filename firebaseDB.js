// Firebase Modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, get, child, onValue} from "firebase/database";
import APIKeys from "./APIKeys.js"; // API Keys


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: APIKeys.apiKey,
  authDomain: APIKeys.authDomain,
  projectId: APIKeys.projectId,
  storageBucket: APIKeys.storageBucket,
  messagingSenderId: APIKeys.messagingSenderId,
  appId: APIKeys.appId,

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase App Initialized:', app.name);


//pushes an image to the database with location, link, and time attributes
export const firebasePushData = (latitude, longitude, imageLink) => {
  try {
    const db = getDatabase(app); 
    const locationRef = push(ref(db, '/images')); // Images 
    set(locationRef, {
      latitude: latitude,
      longitude: longitude,
    
      imageLink: imageLink,
      time: new Date().getTime(),
    });
    console.log('Data Pushed');
  } catch (error) {
    console.error('Error pushing data to Firebase:', error);
  }
};

//pulls data from the firebase realtime database
export const firebasePullData = async () => {
  try {
    const db = getDatabase(app);
    const imagesRef = ref(db, 'images'); // Images 

    const snapshot = await get(imagesRef);
    if (snapshot.exists()) {
      const imageList = snapshot.val();
      // Convert the object to an array
      const imageArray = Object.keys(imageList).map(key => ({
        id: key,
        ...imageList[key]
      }));
      return imageArray.reverse();
    }
    return []; // Return an empty array if no data exists
  } catch (error) {
    console.error('Error pulling from database: ', error);
    return []; // Return an empty array in case of error
  }
}

export const iterateData = (imageList) =>{
  try{
    Object.keys(imageList).forEach((image) => {
          const {imageLink, latitude, longitude, time} = imageList[image]; //extracts values of each attribute for the image
          console.log(`ImageID ${image}`); //printing each attribute to console
          console.log('imageLink', imageLink);
          console.log("lat", latitude);
          console.log("long", longitude);
          console.log("time", time);
      });
  } catch (error) {
    console.error('Error iterating: ', error);
  }

}

export const getLocations = (imageList) =>{
  
  try{
    const locations = [];
    Object.keys(imageList).forEach((image) => {
          const {imageLink, latitude, longitude} = imageList[image];
          locations.push({latitude: latitude, longitude: longitude, imageLink: imageLink}); //push coordinates with the image link to the list as a dict
      });
    return locations;
  } catch (error) {
    console.error('Error iterating: ', error);
  }
}