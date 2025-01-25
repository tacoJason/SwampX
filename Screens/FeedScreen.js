import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { firebasePullData } from '../firebaseDB';

export default function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const itemsPerPage = 5;

  // Function to fetch data from the database
  const fetchMoreData = () => {
    if (isLoading || endReached) return;

    setIsLoading(true);

    firebasePullData().then((entries) => {
      if (!Array.isArray(entries)) {
        console.error('Data fetched is not an array');
        setIsLoading(false);
        return;
      }

      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newItems = entries.slice(startIndex, endIndex);

      if (newItems.length === 0) {
        setEndReached(true);
      } else {
        setData((prevData) => [...prevData, ...newItems]);
        setPage((prevPage) => prevPage + 1);
      }

      setIsLoading(false);
    }).catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchMoreData(); // Load initial data
  }, []);

  const renderFooter = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
    }
    if (endReached) {
      return <Text style={styles.endMessage}>No more data to load</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imageLink }} style={styles.image} />
            <Text>{item.location}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
  },
  loading: {
    marginVertical: 20,
  },
  endMessage: {
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    color: 'gray',
  },
});