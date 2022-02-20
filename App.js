import * as React from 'react';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from './src/navigations/AppNavigator';
import LoginNavigator from './src/navigations/LoginNavigator';
import { checkSignInStatus } from './src/navigations/AppNavigator';

import { FirebaseAuth } from './src/firebase-config';

const rootStack = createStackNavigator();

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
    console.log(user);
  }
  useEffect(() => {
    const subscriber = FirebaseAuth.onAuthStateChanged(onAuthStateChanged);
    console.log(subscriber);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <rootStack.Navigator
        initialRouteName='App'
        screenOptions={() => ({
          headerShown: false,
        })}
      >
        <rootStack.Screen name='App' component={AppNavigator} user={user} />
        {/* <rootStack.Screen name='Auth' component={LoginNavigator} /> */}

      </rootStack.Navigator>
    </NavigationContainer>
  );
}