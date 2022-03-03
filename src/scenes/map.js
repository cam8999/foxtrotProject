import React from 'react';
import {View, Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import MapView from 'react-native-maps';


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
      height: Dimensions.get('window').height,
    },
  });

  return (
    <View style={styles.container}>
      <MapView style={styles.map} />

    </View>
  );
}

export default MapScreen;