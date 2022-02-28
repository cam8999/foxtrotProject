import React from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { map } from 'leaflet';

import {Dimensions, Image, View, Text, FlatList, Button, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import {AppStyle} from '../styles';
import Colours from '../styles'

import './App.css'

import SearchBar from './search';


function MapScreen({ navigation }) {
  


 




  return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Button
          icon={<Ionicons name='home' color='red' size='15'/>}
          title='home'
          onPress={() => document.getElementById('reset').click()}
        />
        <div>
        <style scoped>@import "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"  </style>
      <MapContainer center={[51.505, -0.09]} zoom={13} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      </div>
      <Text>Markers for posts are to be added</Text>
    </View>
  );
}

export default MapScreen;