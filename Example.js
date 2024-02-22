import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from "firebase/auth"
import { auth } from "./firebaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native"

WebBrowser.maybeCompleteAuthSession()

const App = () => {
  const [userInfo, setUserInfo] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

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

  const signOut = async () => {
    await AsyncStorage.removeItem("@user")
    setUserInfo(null)
    await firebaseSignOut(auth)
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
        console.log(user.displayName, "is logged in")
        setUserInfo(user)
      } else {
        console.log("user not authenticated")
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

  return userInfo ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{userInfo.displayName} is logged in</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>not logged in</Text>
      <View style={{ flexDirection: "row", gap: 20 }}>
        <TouchableOpacity onPress={() => promptAsync()}>
          <Text>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default App
