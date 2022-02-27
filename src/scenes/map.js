import React from 'react';
import { View, Text } from 'react-native';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { map } from 'leaflet';




function MapScreen({ navigation }) {



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

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

      <Text>Map map!</Text>
    </View>
  );
}

export default MapScreen;