import React from 'react';
import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

const posts = [
  {
    key: 10,
    author: 'H. Simpson',
    description: 'Research on the effects of Climate Change in Bangladesh.',
    location: 'Location B',
    coordinate: { latitude : 23.810331,  longitude : 90.412521 },
    tags: ['Climate Change', 'Research'],
    mediaType: 'none',
    mediaSource: '',
    upvotes: 4,
    postUpvoted: true,
  },
  {
    key: 12,
    author: 'J. Frink',
    description: 'Study of average temperature increase in Asia.',
    location: 'Location A',
    coordinate: { latitude : 28.613939,  longitude : 77.209023 },
    tags: ['Temperature', 'Climate Change'],
    mediaType: 'image',
    mediaSource: 'https://i.imgur.com/b6BQJPc.jpeg',
    upvotes: 12,
    postUpvoted: false,
  },
]



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

      {posts.map(marker => (
          <Marker
              coordinate={marker.coordinate}
              key = {marker.key}
              title = {marker.author}
              description={marker.description}
          />
      ))}

       
      </MapView>
      <Text>Current latitude: {region.latitude}</Text>
    <Text>Current longitude: {region.longitude}</Text>

    </View>
  );
}

export default MapScreen;