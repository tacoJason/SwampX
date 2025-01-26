import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { firebasePullData, getAllBuildings } from "../firebaseDB";

export default function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const itemsPerPage = 5;
  const [buildingNames, setBuildingNames] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);

  // Load feed
  const fetchMoreData = () => {
    if (isLoading || endReached) return;

    setIsLoading(true);

    firebasePullData()
      .then((entries) => {
        if (!Array.isArray(entries)) {
          console.error("Data fetched is not an array");
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
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  // Refresh feed
  const refreshData = () => {
    setRefreshing(true);
    setPage(1);
    setEndReached(false);

    firebasePullData()
      .then((entries) => {
        if (!Array.isArray(entries)) {
          console.error("Data fetched is not an array");
          setRefreshing(false);
          return;
        }

        const newItems = entries.slice(0, itemsPerPage);
        setData(newItems);
        setPage(2);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchMoreData();
  }, []);

  //loads the building names and relates them to the initial data loaded
  useEffect(() => {
    const fetchBuildingNames = async () => {
      const locations = data.map((item) => ({
        latitude: item.latitude,
        longitude: item.longitude,
      }));
      const buildings = await getAllBuildings(locations);
      setBuildingNames(buildings);
    };

    fetchBuildingNames();
  }, [data]);

  useEffect(() => {
      const fetchLikeCounts = ()=>{
        if (data.length>0){
          const likes = getLikes(data);
          setLikeCounts(likes);
        }
      };
      
        fetchLikeCounts();
    }, [data]);

  const renderFooter = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      );
    }
    if (endReached) {
      return (
        <Text style={styles.endMessage}>🐈 No more cats to see... 🐈‍⬛</Text>
      );
    }
    return null;
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            {/* Image */}
            <Image source={{ uri: item.imageLink }} style={styles.image} />
  
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
                {buildingNames[index]} {/* Show building name */}
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
                ❤️ {likeCounts[index]} {/* Show like count */}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }
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
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  image: {
    width: "60%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 10,
  },
  loading: {
    marginVertical: 20,
  },
  endMessage: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    color: "gray",
  },
});
