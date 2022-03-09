import React, { useState, useRef, useEffect } from 'react';;
import { Text, View, TouchableOpacity, TextInput, Button, Pressable, FlatList, Alert, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { FirebaseAuth, FirebaseDB, getUser, setUserDoc, getUserDoc } from '../firebase-config';
import { updateProfile } from 'firebase/auth';
import { AppStyle } from '../styles';
import Colours from '../styles'

function ProfileScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");     // The name that the user can change. 
  // It is not always necessarily equal to the username held at the database.
  // For that look at user.displayName
  const [editMode, setEditMode] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [userAge, setUserAge] = useState("");

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    getUserDoc(user).then((doc) => {
      setUserAge(doc.Age);
      setUserLocation(doc.Location);
      setUserPosition(doc.Position);
      setUserDescription(doc.Description);
    });
    if (initializing) setInitializing(false);
    setUserName(user.displayName); 
  }

  function onEditModeChanged() {
    if (editMode) { setEditMode(false); changeDetails(); } else { setEditMode(true); }
  }

  useEffect(() => {
    const subscriber = FirebaseAuth.onAuthStateChanged(onAuthStateChanged);
    console.log(subscriber);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function changeDetails() {
    updateProfile(FirebaseAuth.currentUser, {
      displayName: userName
    }).then(() => {
      let userRef = getUser();
      setUserDoc({ 'Username': userName, 'Age': userAge, 'Location': userLocation, 'Position': userPosition, 'Description': userDescription }, user);
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
      <><View style={AppStyle.topBar} />
      <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'center', backgroundColor: '#C0C0C0', padding: 15 }}>
        <View style={AppStyle.profile}>
          <View style={AppStyle.profileHeader}>
            <TextInput
              style={AppStyle.title}
              defaultValue={user.displayName == "" ? "Name" : user.displayName}
              onChangeText={setUserName}
              editable={editMode}
              placeholder={'Name'} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={[AppStyle.profileComponent, { flex: 6, marginRight: 3, flexDirection: 'row' }]}>
              <TextInput
                defaultValue={userPosition}
                editable={editMode}
                placeholder={'Community Position'}
                onChangeText={setUserPosition} />
            </View>
            <View style={[AppStyle.profileComponent, { flex: 1 }]}>
              <TextInput
                defaultValue={userAge}
                editable={editMode}
                placeholder={'Age'}
                keyboardType={'number-pad'}
                onChangeText={setUserAge} />
            </View>
          </View>
          <View style={[AppStyle.profileComponent, { flexDirection: 'row', alignItems: 'center' }]}>
            <Ionicons name="location" size={16} color={Colours.PRIMARY} />
            <Text> </Text>
            <TextInput
              defaultValue={userLocation}
              editable={editMode}
              placeholder={'Location'}
              onChangeText={setUserLocation} />
          </View>
          <TextInput
            style={AppStyle.profileDescription}
            defaultValue={userDescription}
            editable={editMode}
            placeholder={'User description...'}
            onChangeText={setUserDescription} />
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
          <FlatList />
        </View>
      </View></>
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