import React, { useState, useRef, useEffect } from 'react';;
import { Text, View, TouchableOpacity, TextInput, Button, Pressable, FlatList, Alert, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { FirebaseAuth, FirebaseDB, getUser, setUserDoc } from '../firebase-config';
import { updateProfile } from 'firebase/auth';
import { AppStyle } from '../styles';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Colours from '../styles'

function ProfileScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");     // The name that the user can change. 
  // It is not always necessarily equal to the username held at the database.
  // For that look at user.displayName
  const [editMode, setEditMode] = useState(false);

  const [userLocation, setUserLocation] = useState("");

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setUserName(user.displayName);

  }

  function onEditModeChanged() {
    if (editMode) { setEditMode(false); ChangeName(); } else { setEditMode(true); }
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
      let userRef = getUser();
      setUserDoc({ 'Username': userName }, user);
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

      <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'center', backgroundColor: '#C0C0C0' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', height: 80, width: '100%', backgroundColor: Colours.PRIMARY }}>

        </View>
        <View style={AppStyle.profile}>
          <View style={AppStyle.profileHeader}>
            <TextInput
              style={AppStyle.title}
              defaultValue={user.displayName == "" ? "Name" : user.displayName}
              onChangeText={setUserName}
              editable={editMode}
              placeholder={'Name'}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={[AppStyle.profileComponent, { flex: 4, marginRight: 3 }]}>
              <TextInput
                defaultValue={''}
                editable={editMode}
                placeholder={'Community Position'}
              />
            </View>
            <View style={[AppStyle.profileComponent, { flex: 1 }]}>
              <TextInput
                defaultValue={''}
                editable={editMode}
                placeholder={'Age'}
                keyboardType={'number-pad'}
              />
            </View>
          </View>
          <TextInput
            style={AppStyle.profileDescription}
            defaultValue={''}
            editable={editMode}
            placeholder={'User description...'}
          />
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
          <Pressable style={[AppStyle.button]} onPress={onEditModeChanged}>
            <Text style={AppStyle.buttonTitle}>
              {editMode ?
                'Save Changes'
                : 'Edit Profile'}
            </Text>
          </Pressable>
          <Pressable style={AppStyle.button} onPress={signOut}>
            <Text style={AppStyle.buttonTitle}>Sign Out</Text>
          </Pressable>
        </View>
        <View style={{ width: '100%' }}>
          <FlatList
          //TODO: Render posts by the user
          />
        </View>
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