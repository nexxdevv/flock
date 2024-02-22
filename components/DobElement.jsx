import {
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Keyboard,
  StyleSheet
} from "react-native"
import { useState, useRef } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import { CheckIcon } from "./InputElement"

export const DobElement = ({ colors, label, value, setValue }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [date, setDate] = useState(new Date())
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
    setIsFocused(value !== "" || isFocused) // Keep isFocused true if there is content
    Animated.timing(labelPosition, {
      toValue: value !== "" ? 0 : 20,
      duration: 200,
      useNativeDriver: false
    }).start()
  }
  const togglePicker = () => {
    setShowPicker(!showPicker)
    if (!showPicker) {
      Keyboard.dismiss()
    }
  }
  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate
      setDate(currentDate)
    } else {
      togglePicker()
    }
  }
  const confirmIOSDate = () => {
    setValue(date.toDateString())
    togglePicker()
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
      {!showPicker && <CheckIcon value={value} colors={colors} />}

      {showPicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
          style={styles.datepicker}
        />
      )}
      {showPicker && Platform.OS === "ios" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 10,
            marginTop: -26
          }}
        >
          <TouchableOpacity style={styles.button} onPress={togglePicker}>
            <Text style={[styles.buttonText, { color: colors.faded }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={confirmIOSDate}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
      <Pressable onPress={togglePicker}>
        {!showPicker && (
          <TextInput
            editable={false}
            value={value}
            onChangeText={setValue}
            placeholderTextColor={colors.faded}
            onPressIn={togglePicker}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              styles.input,
              {
                borderBottomWidth: showPicker ? 0 : 1,
                borderColor: colors.border
              }
            ]}
          />
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  inputsContainer: {
    paddingHorizontal: 16,
    gap: 40,
    flex: 1
  },
  inputContainer: {
    position: "relative",
    width: "100%"
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
    borderBottomWidth: 1,
    width: "100%"
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
