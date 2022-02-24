import React, { useState, useRef, useEffect } from 'react';;
import { Text, View, TouchableOpacity, TextInput, Button } from 'react-native';

import { FirebaseAuth, FirebaseDB } from '../firebase-config';
import { updateProfile } from 'firebase/auth';

function ProfileScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");     // The name that the user can change. 
  // It is not always necessarily equal to the username held at the database.
  // For that look at user.displayName

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setUserName(user.displayName);

  }
  useEffect(() => {
    const subscriber = FirebaseAuth.onAuthStateChanged(onAuthStateChanged);
    console.log(subscriber);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function ChangeName() {
    updateProfile(FirebaseAuth.currentUser, {
      displayName: userName
    }).then(() => {
      console.log("Profile updated");
    }).catch((error) => {
      console.log("error");
    });
  }

  async function signOut() {
    FirebaseAuth.signOut().then(() => console.log("Signed out"));
  }
  console.log(user);
  if (user) {
    return (

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
        <TextInput
          placeholder={user.displayName == "" ? "Name" : user.displayName}
          onChangeText={setUserName}
        />
        <TouchableOpacity onPress={ChangeName}>
          <Text>Change Name</Text>
        </TouchableOpacity>
        <Button title='Sign out' onPress={signOut}></Button>
      </View>
    );
  } else {
    return (

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading ...</Text>
      </View>
    );
  }
}

export default ProfileScreen;