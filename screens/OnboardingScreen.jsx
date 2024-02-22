import * as React from "react"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native"
import LogoHeader from "../components/LogoHeader"
import { useTheme } from "@react-navigation/native"
import Svg, { Path } from "react-native-svg"
import { auth, db } from "../firebaseConfig"
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged
} from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { setDoc, doc } from "firebase/firestore"

WebBrowser.maybeCompleteAuthSession()

const GoogleLogo = () => {
  return (
    <Svg
      stroke-width="0"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      enable-background="new 0 0 48 48"
      height="22px"
      width="22px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></Path>
      <Path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></Path>
      <Path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></Path>
      <Path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></Path>
    </Svg>
  )
}
const HaveAnAccount = ({ navigation, colors }) => {
  return (
    <View style={styles.haveAnAccountContainer}>
      <Text style={[styles.haveAnAccountText, { color: colors.faded }]}>
        Have have an account already?
      </Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={[styles.haveAnAccountText, { color: colors.primary }]}>
          Log in
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const OnboardingScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = React.useState()
  const [loading, setLoading] = React.useState(false)

  const { colors } = useTheme()

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId:
      "384055557207-r1296h1edumdh3gtom4a0dqeuirqkaup.apps.googleusercontent.com"
  })

  const getLocalUser = async () => {
    try {
      setLoading(true)
      const userJSON = await AsyncStorage.getItem("@user")
      const userData = userJSON ? JSON.parse(userJSON) : null
      setUserInfo(userData)
    } catch (e) {
      console.log(e, "Error getting local user")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params
      const credential = GoogleAuthProvider.credential(id_token)
      signInWithCredential(auth, credential)
    }
  }, [response])

  React.useEffect(() => {
    getLocalUser()
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("@user", JSON.stringify(user))
        setUserInfo(user)
        navigation.navigate("Home")
      } else {
        setLoading(false)
        setUserInfo(null)
      }
    })
    return () => unsub()
  }, [])

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    )

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={{ flex: 1, paddingHorizontal: 32, marginTop: 8 }}>
        <LogoHeader colors={colors} />
        <Text style={[styles.title, { color: colors.text }]}>
          Exchange news & your latest experiences.
        </Text>
        <View style={{ marginTop: "auto", gap: 12 }}>
          <TouchableOpacity
            onPress={() => promptAsync()}
            style={{
              backgroundColor: "white",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              width: "100%",
              justifyContent: "center",
              height: 34
            }}
          >
            <GoogleLogo />
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600"
              }}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={{
              backgroundColor: colors.text,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 50,
              width: "100%",
              height: 34
            }}
          >
            <Text
              style={{
                color: colors.background,
                textAlign: "center",
                fontWeight: "600"
              }}
            >
              Get started
            </Text>
          </TouchableOpacity>
          <Text style={[styles.smallText, { color: colors.faded }]}>
            By signing up, you agree to our{" "}
            <Text style={{ color: colors.primary }}>Terms</Text>,{" "}
            <Text style={{ color: colors.primary }}>Privacy Policy</Text>, and{" "}
            <Text style={{ color: colors.primary }}>Cookie Use</Text>.
          </Text>
          <HaveAnAccount navigation={navigation} colors={colors} />
        </View>
      </View>
    </SafeAreaView>
  )
}
export default OnboardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%"
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    marginTop: 190
  },
  smallText: {
    fontSize: 12,
    marginTop: 12,
    letterSpacing: -0.2,
    lineHeight: 18
  },
  highlight: {
    color: "#639EFF"
  },
  haveAnAccountContainer: {
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 12,
    justifyContent: "flex-start"
  },
  haveAnAccountText: {
    fontSize: 14
  },
  loginButton: {
    marginLeft: 4
  }
})
