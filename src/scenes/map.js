import React from 'react';
import {View, Text, Alert} from 'react-native';
import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Post from '../components/post.js';






function MapScreen({navigation}) {

  

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

      {Post.examplePosts.map(marker => (
          <Marker
              coordinate={marker.coordinates}
              key = {marker.id}
              title = {marker.author}
              description={marker.description}
              onPress={(e) => {e.stopPropagation(); navigation.navigate("Home", {postsToDisplay: marker});}}
          />
      ))}

       
      </MapView>
      <Text>Current latitude: {region.latitude}</Text>
    <Text>Current longitude: {region.longitude}</Text>

    </View>
  );
}

export default MapScreen;