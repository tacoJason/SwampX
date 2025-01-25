// Firebase Modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";
import APIKeys from "./APIKeys.js"; // Private API Keys

// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: APIKeys.apiKey,
  authDomain: APIKeys.authDomain,
  projectId: APIKeys.projectId,
  storageBucket: APIKeys.storageBucket,
  messagingSenderId: APIKeys.messagingSenderId,
  appId: APIKeys.appID

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebasePushData = (longitude, latitude, imageLink) => {
  const db = getDatabase(app);
  const ref = push(ref(db, '/images'));
  set(ref, {
    longitude: longitude,
    latitude: latitude,
    imageLink: imageLink,
    time: new Date().getTime()
  });
}