import { StyleSheet, View } from "react-native"
import { useTheme } from "@react-navigation/native"
const Logo = () => {
  const { colors } = useTheme()
  const height = 5
  const width = 24
  const legWidth = 5
  const legHeight = 12
  return (
    <View style={{ marginTop: 4, position: "relative" }}>
      <View style={{ width, height, backgroundColor: colors.text }} />
      <View
        style={{ width: width - 3, height: 1, backgroundColor: colors.text, marginTop: 6 }}
      />
      <View
        style={{
          width: legWidth,
          height: legHeight,
          backgroundColor: colors.text
        }}
      />
     
    </View>
  )
}
export default Logo
const styles = StyleSheet.create({})
