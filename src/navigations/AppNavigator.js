import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
//import 'react-native-gesture-handler';  // TODO: Figure out why this import causes 100 warnings

import {HomeScreen, MapScreen, ProfileScreen } from "../scenes";
import Colours from '../styles'


const appTabs = createBottomTabNavigator();

const AppNavigator = () => (
  <appTabs.Navigator
    initialRouteName={'Home'}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch(route.name) {
          case 'Map': iconName = 'pin'; break;  // TODO: Find better pin icon
          case 'Home': iconName = 'add-circle'; break;
          case 'Profile': iconName = 'person'; break;
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
    <appTabs.Screen name="Profile" component={ProfileScreen} />
  </appTabs.Navigator>
)

export default AppNavigator;

