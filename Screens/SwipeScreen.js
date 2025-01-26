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
          <View style={styles.card}>
            <Image source={{ uri: card.imageLink }} style={styles.image} />
          </View>
        )}
        onSwiped={(cardIndex) => { console.log(cardIndex); }}
        onSwipedAll={() => { console.log('All cards swiped'); }}
        cardIndex={0}
        backgroundColor={'#4FD0E9'}
        stackSize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default SwipeScreen;