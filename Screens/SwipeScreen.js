import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { firebasePullData } from '../firebaseDB';

const SwipeScreen = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    firebasePullData().then((entries) => {
      if (Array.isArray(entries)) {
        // Append a special card with text to the data array
        entries.push({ isFinalCard: true, text: "No more cats to see... 😼" });
        setData(entries);
      } else {
        console.error('Data fetched is not an array');
      }
      setIsLoading(false);
    }).catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={data}
        renderCard={(card) => (
          card.isFinalCard ? (
            <View style={styles.finalCard}>
              <Text style={styles.finalCardText}>{card.text}</Text>
            </View>
          ) : (
            <View style={styles.card}>
              <Image source={{ uri: card.imageLink }} style={styles.image} />
            </View>
          )
        )}
        onSwiped={(cardIndex) => { console.log(cardIndex); }}
        onSwipedAll={() => { console.log('All cards swiped'); }}
        cardIndex={0}
        backgroundColor={'#ffffff'}
        stackSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '100%', // Adjust width as a percentage of the container
      height: '95%', // Adjust height as a percentage of the container
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      alignSelf: 'center', // Ensure the card is centered horizontally
      // Drop shadow properties
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5, // Android-specific shadow
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    finalCard: {
      width: '100%',
      height: '95%',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      alignSelf: 'center',
      // Drop shadow properties
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5, // Android-specific shadow
    },
    finalCardText: {
      fontSize: 24,
      color: 'black',
      textAlign: 'center',
    },
  });
  
  export default SwipeScreen;
  