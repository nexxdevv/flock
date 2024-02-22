import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { auth, db } from "../firebaseConfig"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { signOut as firebaseSignOut, updateProfile } from "firebase/auth"
import { useTheme } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"
import Svg, { Path } from "react-native-svg"

const BlueCheck = () => {
  return (
    <Svg
      viewBox="0 0 22 22"
      fill={"#1D9BF0"}
      height={14}
      width={14}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Verified account"
      role="img"
      data-testid="icon-verified"
      style={{ transform: [{ translateY: -1.5 }] }}
    >
      <Path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></Path>
    </Svg>
  )
}

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null)

  const { colors } = useTheme()

  const handleSignOut = async () => {
    auth.signOut()
    await AsyncStorage.removeItem("@user")
    setUser(null)
    await firebaseSignOut(auth)
    navigation.navigate("Onboarding")
  }
  const getUser = async () => {
    const userId = auth?.currentUser.uid
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setUser(docSnap.data())
    } else {
      setDoc(doc(db, "users", userId), {
        displayName: auth?.currentUser.displayName,
        name: auth?.currentUser.displayName,
        email: auth?.currentUser.email,
        photoURL: auth?.currentUser.photoURL,
        createdAt: new Date().toUTCString()
      })
      updateProfile(auth.currentUser, {
        displayName: auth?.currentUser.displayName,
        photoURL: auth?.currentUser.photoURL
      })
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.border,
          padding: 12
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "start",
            gap: 8
          }}
        >
          <Image
            source={{ uri: user?.photoURL }}
            style={{ width: 44, height: 44, borderRadius: 50 }}
          />
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "start",
                gap: 3,
                width: "100%"
              }}
            >
              <Text
                style={[
                  styles.tightSpacing,
                  {
                    fontSize: 14,
                    fontWeight: "700",
                    color: colors.text,
                    transform: [{ translateY: -2.5 }]
                  }
                ]}
              >
                {user?.displayName}
              </Text>
              <BlueCheck />
              <Text
                style={[
                  styles.tightSpacing,
                  {
                    fontSize: 13,
                    fontWeight: "400",
                    transform: [{ translateY: -2.5 }],
                    color: colors.faded,
                    marginLeft: 1
                  }
                ]}
              >
                @{user?.username}
              </Text>
              <Text
                style={[
                  styles.tightSpacing,
                  {
                    transform: [{ translateY: -2.5 }],
                    color: colors.faded,
                    fontSize: 13
                  }
                ]}
              >
                · 8h
              </Text>
              <TouchableOpacity
                style={{
                  marginLeft: "auto",
                  transform: [{ translateY: -2.5 }]
                }}
              >
                <Icon
                  name="more-horizontal"
                  size={17}
                  color={colors.moreFaded}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: colors.text,
                transform: [{ translateY: -2.2 }],
                letterSpacing: -0.1
              }}
            >
              You forgot something, man!
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 6
              }}
            >
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Icon
                  name="message-circle"
                  size={13}
                  color={colors.moreFaded}
                />
                <Text style={{ color: colors.faded, fontSize: 12 }}>25</Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Icon name="share-2" size={13} color={colors.moreFaded} />
                <Text style={{ color: colors.faded, fontSize: 12 }}>37</Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Icon name="heart" size={13} color={colors.moreFaded} />
                <Text style={{ color: colors.faded, fontSize: 12 }}>526</Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Icon name="activity" size={13} color={colors.moreFaded} />
                <Text style={{ color: colors.faded, fontSize: 12 }}>1.9M</Text>
              </View>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Icon name="bookmark" size={13} color={colors.moreFaded} />
              </View>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Icon name="share" size={13} color={colors.moreFaded} />
              </View>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}
export default HomeScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16
  },
  tightSpacing: {
    letterSpacing: -0.3
  }
})
