import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeScreen, LoginScreen, MapScreen, ProfileScreen, UploadScreen } from "./src/scenes";
import Colours from './src/styles'

import { FirebaseAuth, FirebaseDB, db, getUserDoc } from './src/firebase-config';

import { doc, getDoc } from 'firebase/firestore'

// const rootStack = createStackNavigator();

const appTabs = createBottomTabNavigator();

let isSignedIn = false;


export async function checkSignInStatus() {
  const user = FirebaseAuth.currentUser;
  if (user) {
    console.log("Logged in!");
    // console.log(user);
    isSignedIn = true;
  } else {
    console.log("Needs to register!");
    isSignedIn = false;
  }
}

export default function App() {
  //console.log("test");

  
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();


  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    console.log("Auth Prints User");
    checkSignInStatus();
    getUserDoc(user);
    console.log(user);
  }
  useEffect(() => {
    const subscriber = FirebaseAuth.onAuthStateChanged(onAuthStateChanged);
    console.log(subscriber);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <appTabs.Navigator
        initialRouteName={'Home'}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Map': iconName = 'location'; break;
              case 'Home': iconName = 'home'; break;
              case 'Upload': iconName = 'add-circle'; break;
              case 'Profile': iconName = 'person'; break;
              case 'Login': iconName = 'log-in'; break;
              default: iconName = '';
            }

            return <Ionicons name={iconName} size={focused ? size + 10 : size} color='white' />;
          },
          tabBarStyle: {
            height: 80,
            backgroundColor: Colours.PRIMARY,
          },
        })}
      >

        <appTabs.Screen name="Map" component={MapScreen} />
        <appTabs.Screen name="Home" component={HomeScreen} />
        <appTabs.Screen name="Upload" component={UploadScreen} />
        <appTabs.Screen name="Profile" component={user ? ProfileScreen : LoginScreen} />
      </appTabs.Navigator>
    </NavigationContainer>
  )
}