import { useColorScheme } from "react-native"
import { lightTheme, darkTheme } from "./utils/styles/theme"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "./screens/HomeScreen"
import OnboardingScreen from "./screens/OnboardingScreen"
import SignUpScreen from "./screens/SignUpScreen"
import LoginScreen from "./screens/LoginScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  const scheme = useColorScheme()

  return (
    <NavigationContainer theme={scheme === "dark" ? darkTheme : lightTheme}>
      <Stack.Navigator initialRouteName={"Onboarding"}>
        <Stack.Screen
          navigationKey="Home"
          options={{ headerShown: false }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Onboarding"
          component={OnboardingScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false
          }}
          name="SignUp"
          component={SignUpScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
