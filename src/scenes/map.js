import React from 'react';
import { View, Text, Alert, Button, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTopPosts } from '../firebase-config';
import { AppStyle } from '../styles';





function MapScreen({ navigation }) {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    refreshPosts();
  }, []);

  async function refreshPosts() {
    let downloadedPosts = await getTopPosts();
    if (downloadedPosts) {
      downloadedPosts.forEach((post, index) => post.id = index);
      setPosts(downloadedPosts);
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height * 0.8,
    },
  });

  const [region, setRegion] = React.useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  return (
    <View style={AppStyle.homeContainer}>
      <View style={[AppStyle.topBar, { flexDirection: 'row' }]}>
        <TouchableOpacity onPress={() => refreshPosts()} style={{ alignItems: 'center' }}>
          <Ionicons name="refresh" size={30} color={'white'} />
          <Text style={AppStyle.radioMenuText}>Refresh</Text>
        </TouchableOpacity>
        <View />
      </View>
      <MapView style={[styles.map, { flex: 1 }]}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 60,
          longitudeDelta: 60,
        }}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {posts.map((marker, index) =>
          <Marker
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            key={index}
            title={marker.title}
            description={marker.description}
            onPress={(e) => { e.stopPropagation(); navigation.navigate("Home", { postsToDisplay: marker }); }}
          />
        )}
      </MapView>
    </View>
  );
}

export default MapScreen;