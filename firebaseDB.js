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


export const firebasePullData = async()=>{
  try{
    const db = getDatabase(app);
    const imagesRef = ref(db, 'images'); // Images 

    const snapshot = await get(imagesRef);
    if (snapshot.exists()) {
      const imageList = snapshot.val();
      return imageList;
    }
  } catch (error) {
    console.error('Error pulling from database: ', error);
  }
  
}

export const iterateData = (imageList) =>{
  try{
    Object.keys(imageList).forEach((image) => {
          const {imageLink, latitude, longitude, time} = imageList[image];
          console.log(`ImageID ${image}:`, imageList);
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
    locations = [];
    Object.keys(imageList).forEach((image) => {
          const {imageLink, latitude, longitude, time} = imageList[image];
          const coords = [latitude, longitude];
          locations.push({imageLink: coords});
      });
    return locations;
  } catch (error) {
    console.error('Error iterating: ', error);
  }
}