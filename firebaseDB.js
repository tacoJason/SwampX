// Firebase Modules
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  child,
  onValue,
  runTransaction,
} from "firebase/database";
import APIKeys from "./APIKeys.js";

const firebaseConfig = {
  apiKey: APIKeys.apiKey,
  authDomain: APIKeys.authDomain,
  projectId: APIKeys.projectId,
  storageBucket: APIKeys.storageBucket,
  messagingSenderId: APIKeys.messagingSenderId,
  appId: APIKeys.appId,
};

const app = initializeApp(firebaseConfig);
console.log("Firebase App Initialized:", app.name);

//pushes an image to the database with location, link, and time attributes
export const firebasePushData = (latitude, longitude, imageLink) => {
  try {
    const db = getDatabase(app);
    const locationRef = push(ref(db, "/images")); // Images
    set(locationRef, {
      latitude: latitude,
      longitude: longitude,
      imageLink: imageLink,
      time: new Date().getTime(),
      likes: 0,
    });
    console.log("Data Pushed");
  } catch (error) {
    console.error("Error pushing data to Firebase:", error);
  }
};

//pulls data from the firebase realtime database
export const firebasePullData = async () => {
  try {
    const db = getDatabase(app);
    const imagesRef = ref(db, "images");

    const snapshot = await get(imagesRef);
    if (snapshot.exists()) {
      const imageList = snapshot.val();
      // convert to an array
      const imageArray = Object.keys(imageList).map((key) => ({
        id: key,
        ...imageList[key],
      }));
      return imageArray.reverse();
    }
    return [];
  } catch (error) {
    console.error("Error pulling from database: ", error);
    return [];
  }
};

export const getLikes = (imageList) => {
  try {
    const likesList = [];
    Object.keys(imageList).forEach((image) => {
      const { likes } = imageList[image]; //extracts likes for each image
      likesList.push(likes || 0);
      console.log("likes", likes);
    });
    return likesList;
  } catch (error) {
    console.error("error getting likes", error);
    return [];
  }
};

export const addLike = async (imageId) => {
  try {
    const db = getDatabase(app);
    const refUpdate = ref(db, `/images/${imageId}/likes`);
    await runTransaction(refUpdate, (currentLikes) => {
      if (currentLikes === 0) {
        return 1;
      } else {
        return currentLikes + 1;
      }
    });
    console.log(`added like ${imageId}`);
  } catch (error) {
    console.error("Error adding like", error);
  }
};

export const iterateData = (imageList) => {
  try {
    Object.keys(imageList).forEach((image) => {
      const { imageLink, latitude, longitude, time } = imageList[image]; //extracts values of each attribute for the image
      console.log(`ImageID ${image}`); //printing each attribute to console
      console.log("imageLink", imageLink);
      console.log("lat", latitude);
      console.log("long", longitude);
      console.log("time", time);
    });
  } catch (error) {
    console.error("Error iterating: ", error);
  }
};

export const getLocations = (imageList) => {
  try {
    const locations = [];
    Object.keys(imageList).forEach((image) => {
      const { imageLink, latitude, longitude } = imageList[image];
      locations.push({
        latitude: latitude,
        longitude: longitude,
        imageLink: imageLink,
      }); //push coordinates with the image link to the list as a dict
    });
    return locations;
  } catch (error) {
    console.error("Error iterating: ", error);
  }
};

export const getBuilding = async (latitude, longitude) => {
  if (typeof latitude === "number" && typeof longitude === "number") {
    if (
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${APIKeys.geoCodeApiID}`;
      console.log("reverse geocoding", reverseGeocodingUrl);

      const response = await fetch(reverseGeocodingUrl);

      if (!response.ok) {
        console.error("Reverse geocoding API call failed:", response.status);
        return;
      }
      const featureCollection = await response.json();

      if (featureCollection.features.length === 0) {
        console.log("The address is not found");
        return;
      }

      //parses through the address and returns just the building name
      const foundAddress = featureCollection.features[0].properties.formatted;
      console.log("Address Found:", foundAddress.split(",")[0]);
      return foundAddress.split(",")[0];
    } else {
      console.log("invalid latitude or longitude range.");
    }
  } else {
    console.log("invalid latitude or longitude range.");
  }
};

export const getAllBuildings = async (locationList) => {
  try {
    const buildingNames = await Promise.all(
      locationList.map(async (image) => {
        const buildingName = await getBuilding(image.latitude, image.longitude);
        return buildingName; // collect each building name
      })
    );
    return buildingNames; // return the array of building names
  } catch (error) {
    console.error("Error getting all buildings:", error);
    return [];
  }
};
