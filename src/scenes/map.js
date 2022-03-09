import React from 'react';
import {View, Text, Alert, Button} from 'react-native';
import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import { useState, useEffect } from 'react';

import { getUser, getTopPosts, getPostsByTag, getPostsByLocation, getPostsByUsername, getPostsByTitle, getFilesForPost, uploadPostToDB } from '../firebase-config';





function MapScreen({navigation}) {

  const [posts, setPosts] = useState([]);

  function buttonpress()
  {
    filterPosts('',null);
    console.log(posts);
    console.log(posts.length.toString());

  }


  useEffect(() => {
     filterPosts('', null);  
  }, []);

  async function filterPosts(query, queryType) {
    let promise;
    console.log('filterPosts - Downloading Posts');
    console.log('filterPosts - Query type: ' + queryType);
    if (query == '' || queryType == null) promise = getTopPosts();
  
    console.log('filterPosts - Awaiting Posts');
    let downloadedPosts = await promise;
    console.log('filterPosts - Downloaded Posts');
    if (downloadedPosts) {
      
      setPosts(downloadedPosts);
      console.log('this');
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
      height: Dimensions.get('window').height*0.8,
    },
  });


  const [region, setRegion] = React.useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  return (
    <View style={styles.container}>
      <MapView style={styles.map} 
      
      initialRegion={{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 60,
        longitudeDelta: 60,
      }}
      onRegionChangeComplete={(region) => setRegion(region)}
      >

      {posts.map(marker => (
          <Marker
              coordinate={{latitude: marker.Latitude, longitude:marker.Longitude}}
              key = {marker.id}
              title = {marker.author}
              description={marker.description}
              onPress={(e) => {e.stopPropagation(); navigation.navigate("Home", {postsToDisplay: marker});}}
          />
      ))}

       
      </MapView>
     <Button title = {'Refresh'} onPress={buttonpress}> </Button>

    </View>
  );
}

export default MapScreen;