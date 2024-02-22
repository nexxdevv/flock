import { signInWithEmailAndPassword } from "firebase/auth"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import { auth } from "../firebaseConfig"

const LoginScreen = ({ navigation }) => {
  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email.trim(), password)
      .then(() => navigation.navigate("Home"))
      .catch((err) => {
        const errorCode = err.code
        const errorMessage = err.message
        console.log(errorCode, errorMessage)
      })
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>LoginScreen</Text>
      </View>
    </SafeAreaView>
  )
}
export default LoginScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  }
})
