import { useState, useRef, useEffect } from "react"
import { TextInput, View, Animated, StyleSheet } from "react-native"
import Svg, { Path } from "react-native-svg"

export const CheckIcon = ({ value, colors }) => {
  const iconOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(iconOpacity, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start()
  }, [iconOpacity, value])

  return (
    <Animated.View style={{ opacity: iconOpacity }}>
      <Svg
        stroke={colors.primary}
        fill={colors.primary}
        viewBox="0 0 512 512"
        width={22}
        height={22}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          right: 0,
          bottom: -18
        }}
      >
        <Path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></Path>
      </Svg>
    </Animated.View>
  )
}
export const InputElement = ({
  label,
  colors,
  value,
  setValue,
  secureTextEntry,
  placeholder,
  autoCapitalize
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const labelPosition = useRef(new Animated.Value(0)).current

  const handleFocus = () => {
    setIsFocused(true)
    Animated.timing(labelPosition, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start()
  }

  const handleBlur = () => {
    setIsFocused(value !== "" || isFocused)
    Animated.timing(labelPosition, {
      toValue: value !== "" || placeholder ? 0 : 20,
      duration: 200,
      useNativeDriver: false
    }).start()
  }

  return (
    <View style={styles.inputContainer}>
      <Animated.Text
        style={[
          styles.label,
          { top: labelPosition, color: colors.faded },
          value !== "" && styles.labelFocused
        ]}
      >
        {label}
      </Animated.Text>
      <CheckIcon value={value} colors={colors} />
      <TextInput
        style={[
          styles.input,
          { borderBottomWidth: 1, borderColor: colors.border }
        ]}
        value={value}
        onChangeText={(text) =>
          value === "email" ? setValue(text.toLowerCase()) : setValue(text)
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 40,
    flex: 1
  },
  inputContainer: {
    width: "100%",
    position: "relative"
  },
  label: {
    position: "absolute",
    left: 0
  },
  labelFocused: {
    top: -20,
    fontSize: 12
  },
  input: {
    paddingBottom: 12,
    color: "#2ECE2E",
    borderBottomWidth: 1
  },
  datepicker: {
    height: 120,
    marginTop: 40
  },
  button: {
    width: "50%",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 40
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16
  }
})
