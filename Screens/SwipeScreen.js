/*
    This is the main feed screen of the app. It holds the animations and 
    swipe functionality of the screen.
*/

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { X, Heart } from 'lucide-react-native';
import { firebasePullData, getAllBuildings , addLike, getLikes} from '../firebaseDB';

const { width, height } = Dimensions.get('window');

const SwipeScreen = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeAnim = useRef(new Animated.Value(0)).current; // For swipe animation
  const fadeInAnim = useRef(new Animated.Value(1)).current; // For new image fade-in
  const [isTransitioning, setIsTransitioning] = useState(false); // Prevent overlapping transitions
  const [buildingNames, setBuildingNames] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await firebasePullData(); // Fetch images from Firebase
        setImages(fetchedImages);
      } catch (error) { // If error...
        console.error('Error fetching images:', error);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    const fetchBuildingNames = async() =>{ // Fetch building names for each image
      if (images.length>1){
      const locations = images.map(item =>({latitude : item.latitude, longitude: item.longitude}));
      const buildings = await getAllBuildings(locations);
      setBuildingNames(buildings);
      }
    };
    if (images.length>0){
      fetchBuildingNames();
    }
  }, [images]);

  useEffect(() => {
    const fetchLikeCounts = ()=>{ // Grabs the number of likes on a photo
      if (images.length>0){
        const likes = getLikes(images);
        setLikeCounts(likes);
      }
    };
    
      fetchLikeCounts();
  }, [images]);


  const handleSwipe = (direction) => { // direction = 'left' or 'right'
    if (direction ==='right' && images[currentIndex]){ // if 'right' add like
      addLike(images[currentIndex].id);
    }
    if (isTransitioning || currentIndex >= images.length - 1) return;

    setIsTransitioning(true);

    // Animate the swipe (left or right)
    Animated.timing(swipeAnim, {
      toValue: direction === 'left' ? -1 : 1, // If left, -1; if right, 1
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Once swipe animation completes, update the index and reset swipeAnim
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      swipeAnim.setValue(0);

      // Start fade-in animation for the new image
      fadeInAnim.setValue(0);
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsTransitioning(false); // Allow new interactions after the animation
      });
    });
  };

  if (images.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const currentImage = images[currentIndex];

  const translateX = swipeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width, 0, width],
  });

  const rotate = swipeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Header with logo */}
      <View
        style={{
          width: '100%',
          height: 120,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Image
          source={require('../assets/tenderBanner.png')}
          style={{ width: 200, height: 200, resizeMode: 'contain', marginTop: 35 }}
        />
      </View>

      {/* Main content */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 20,
        }}
      >
        {/* Animated image container */}
        <Animated.View
  style={{
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 20,
    transform: [{ translateX }, { rotateZ: rotate }],
    opacity: swipeAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.5, 1, 0.5],
    }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: currentIndex === images.length - 1 ? '#ffffff' : 'transparent', // Background for text box
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  {currentIndex === images.length - 1 ? (
    <Text
      style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 20,
      }}
    >
      No more cats to be seen... 😼
    </Text>
  ) : (
    <>
      <Animated.Image
        source={{ uri: currentImage.imageLink }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 20,
          opacity: fadeInAnim,
          transform: [
            {
              scale: fadeInAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        }}
        resizeMode="cover"
      />
      {/* Bottom-left text */}
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {buildingNames[currentIndex]}

        </Text>
      </View>
      {/* Bottom-right text */}
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          ❤️
          {likeCounts[currentIndex]}
        </Text>
      </View>
    </>
  )}
</Animated.View>



        {/* Swipe controls */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => handleSwipe('left')}
            style={{
              backgroundColor: '#e2574c',
              padding: 20,
              borderRadius: 50,
              marginRight: 50,
              opacity: currentIndex >= images.length - 1 ? 0.5 : 1,
            }}
            disabled={isTransitioning || currentIndex >= images.length - 1}
          >
            <X color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSwipe('right')}
            style={{
              backgroundColor: '#59ad6a',
              padding: 20,
              borderRadius: 50,
              opacity: currentIndex >= images.length - 1 ? 0.5 : 1,
            }}
            disabled={isTransitioning || currentIndex >= images.length - 1}
          >
            <Heart color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SwipeScreen;
