import React, { useState, useRef, useEffect } from 'react';;
import { Text, View, TouchableOpacity, TextInput, Button } from 'react-native';

import { FirebaseApp, FirebaseAuth, FirebaseDB } from '../firebase-config';

function ProfileScreen({ navigation }) {
  async function doLogin() {
    const user = FirebaseAuth.currentUser;
    if (user) {
      console.log("Logged in!");
      console.log(user);
    } else {
      console.log("Needs to register!");
      let parent = navigation.getParent();
      parent.navigate('Auth');
    }
  }

  return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

export default ProfileScreen;