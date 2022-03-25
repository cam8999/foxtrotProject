import React, { useState, useRef, useEffect } from 'react';;
import { Text, View, ScrollView, TouchableOpacity, TextInput, Button, Pressable, FlatList, Alert, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { FirebaseAuth, FirebaseDB, getUser, setUserDoc, getUserDoc, getPostsByUserUID } from '../firebase-config';
import { updateProfile } from 'firebase/auth';
import { AppStyle } from '../styles';
import Colours from '../styles'
import Post from '../components/post';

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
  const [userPosts, setUserPosts] = useState([]);
  const profileScrollRef = useRef();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    getUserDoc(user).then((doc) => {
      setUserAge(doc.Age);
      setUserLocation(doc.Location);
      setUserPosition(doc.Position);
      setUserDescription(doc.Description);
    }).then(
      getPostsByUserUID(user.uid, 10).then((posts) => {
        setUserPosts(posts);
      }));
    if (initializing) setInitializing(false);
    setUserName(user.displayName);
  }

  function onEditModeChanged() {
    if (editMode) {
      setEditMode(false);
      changeDetails();
    } else {
      profileScrollRef.current?.scrollTo({ y: 0, animated: true });
      setEditMode(true);
    }
  }

  function onRefresh() {
    getPostsByUserUID(user.uid, 10).then((posts) => {
      setUserPosts(posts);
    })
  }

  useEffect(() => {
    const subscriber = FirebaseAuth.onAuthStateChanged(onAuthStateChanged);
    //console.log(subscriber);
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

  //console.log(user);
  if (user) {
    return (
      <View style={{ backgroundColor: '#C0C0C0', height: '100%' }}>
        <View style={AppStyle.topBar}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={signOut} style={{ alignItems: 'center' }}>
                <Ionicons name="exit" size={30} color={'white'} />
                <Text style={AppStyle.radioMenuText}>Sign Out</Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity style={{ alignItems: 'center' }}>
                <Ionicons name="refresh" onPress={onRefresh} size={30} color={'white'} />
                <Text style={AppStyle.radioMenuText}>Refresh</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onEditModeChanged} style={{ alignItems: 'center' }}>
              {editMode ?
                <>
                  <Ionicons name="checkmark" size={30} color={'white'} />
                  <Text style={AppStyle.radioMenuText}>Save Changes</Text>
                </>
                :
                <>
                  <Ionicons name="pencil" size={30} color={'white'} />
                  <Text style={AppStyle.radioMenuText}>Edit Profile</Text>
                </>
              }
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView ref={profileScrollRef}>
          <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'center', backgroundColor: '#C0C0C0', paddingHorizontal: 15 }}>
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
                <View style={[AppStyle.profileComponent, { flex: 6, marginRight: 3, flexDirection: 'row' }]}>
                  <TextInput
                    defaultValue={userPosition}
                    editable={editMode}
                    placeholder={'Community Position'}
                    onChangeText={setUserPosition}
                  />
                </View>
                <View style={[AppStyle.profileComponent, { flex: 1 }]}>
                  <TextInput
                    defaultValue={userAge}
                    editable={editMode}
                    placeholder={'Age'}
                    keyboardType={'number-pad'}
                    onChangeText={setUserAge}
                  />
                </View>
              </View>
              <View style={[AppStyle.profileComponent, { flexDirection: 'row', alignItems: 'center' }]}>
                <Ionicons name="location" size={16} color={Colours.PRIMARY} />
                <TextInput
                  defaultValue={userLocation}
                  editable={editMode}
                  placeholder={'Location'}
                  onChangeText={setUserLocation}
                />
              </View>
              <TextInput
                style={AppStyle.profileDescription}
                defaultValue={userDescription}
                editable={editMode}
                placeholder={'User description...'}
                onChangeText={setUserDescription}
              />
            </View>
            <View style={[AppStyle.postsContainer, { width: '100%', height: '100%' }]}>
              {userPosts.length == 0 ?
                <View style={AppStyle.bubble}>
                  <Text style={AppStyle.lightText}>No Posts</Text>
                </View>
                : null}
              {userPosts.map((post) => <Post {...post} key={post.id} displayDelete={true} />)}
            </View>
            <View style={{ height: 15 }}></View>
          </View>
        </ScrollView>
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