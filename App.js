import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from './src/navigations/AppNavigator';
import LoginNavigator from './src/navigations/LoginNavigator';

const rootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer> 
      <rootStack.Navigator
        initialRouteName='App'
        screenOptions = {() => ({
          headerShown: false,
        })}
      >
        <rootStack.Screen name='Auth' component={LoginNavigator} />
        <rootStack.Screen name='App' component={AppNavigator} />
      </rootStack.Navigator>
    </NavigationContainer>
  );
}