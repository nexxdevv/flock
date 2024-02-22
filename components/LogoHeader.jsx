import { Pressable, StyleSheet, Text, View } from "react-native"
import Logo from "./Logo"

const LogoHeader = ({ navigation, colors, text }) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text
          style={{
            color: colors.text,
            fontSize: 17,
            transform: [{ translateY: 5 }]
          }}
        >
          {text}
        </Text>
      </Pressable>
      <View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            height: 30
          }
        ]}
        pointerEvents="none"
      >
        <Logo />
      </View>
    </View>
  )
}
export default LogoHeader
const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    position: "relative"
  }
})
