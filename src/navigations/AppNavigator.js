import { useState } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
//import 'react-native-gesture-handler';  // TODO: Figure out why this import causes 100 warnings

import { HomeScreen, LoginScreen, MapScreen, ProfileScreen } from "../scenes";
import { FirebaseApp, FirebaseAuth, FirebaseDB } from '../firebase-config';
import Colours from '../styles'


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

//checkSignInStatus();

export default function AppNavigator(props) {
  console.log('App navigator props');
  console.log(props);
  return (
    isSignedIn ? (<appTabs.Navigator
      initialRouteName={'Home'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Map': iconName = 'location'; break;
            case 'Home': iconName = 'add-circle'; break;
            case 'Profile': iconName = 'person'; break;
            case 'Login': iconName = 'login'; break;
            default: iconName = '';
          }

          return <Ionicons name={iconName} size={focused ? size + 10 : size} color='white' />;
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: Colours.PRIMARY,
        },
      })}
    >

      <appTabs.Screen name="Map" component={MapScreen} />
      <appTabs.Screen name="Home" component={HomeScreen} />
      <appTabs.Screen name="Profile" component={ProfileScreen} />
    </appTabs.Navigator>

    ) : (<appTabs.Navigator
      initialRouteName={'Home'}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Map': iconName = 'location'; break;
            case 'Home': iconName = 'add-circle'; break;
            case 'Profile': iconName = 'person'; break;
            case 'Login': iconName = 'log-in'; break;
            default: iconName = '';
          }

          return <Ionicons name={iconName} size={focused ? size + 10 : size} color='white' />;
        },
        tabBarStyle: {
          height: 60,
          backgroundColor: Colours.PRIMARY,
        },
      })}
    >

      <appTabs.Screen name="Map" component={MapScreen} />
      <appTabs.Screen name="Home" component={HomeScreen} />
      <appTabs.Screen name="Login" component={LoginScreen} />
    </appTabs.Navigator>

    )
  );
}
