import { createStackNavigator } from "@react-navigation/stack";

import { LoginScreen } from "../scenes";

const loginStack = createStackNavigator();

const LoginNavigator = () => (
  <loginStack.Navigator
    initialRouteName={'Login'}
  >
    <loginStack.Screen name='Login' component={LoginScreen} />
  </loginStack.Navigator>
)

export default LoginNavigator;