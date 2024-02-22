import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import { useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebaseConfig"
import { InputElement } from "../components/InputElement"
import { useTheme } from "@react-navigation/native"
import { DobElement } from "../components/DobElement"
import { ImageUploader } from "../components/ImageUploader"

const AuthScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [username, setUsername] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(false)

  const { colors } = useTheme()

  const handleSignUp = async () => {
    await createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user
        setDoc(doc(db, "users", user.uid), {
          name,
          email,
          dateOfBirth,
          username,
          photoURL,
          createdAt: new Date().toUTCString()
        })
      })
      .then(() => console.log("User created"))
      .then(() => navigation.navigate("Home"))
      .catch((err) => {
        const errorCode = err.code
        const errorMessage = err.message
        console.log(errorCode, errorMessage)
      })
    await updateProfile(auth.currentUser, {
      displayName: username,
      photoURL,
      email
    }).catch((err) => console.log(err))
  }
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
      <View style={styles.formContainer}>
        
      </View>
    </SafeAreaView>
  )
}
export default AuthScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  formContainer: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 16,
    flex: 1,
    gap: 40
  }
})
