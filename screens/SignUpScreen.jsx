import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Keyboard,
  Button,
  Image
} from "react-native"
import { useTheme } from "@react-navigation/native"
import { useState, useRef, useEffect } from "react"
import DateTimePicker from "@react-native-community/datetimepicker"
import Svg, { Path } from "react-native-svg"
import * as ImagePicker from "expo-image-picker"
import { auth, db } from "../firebaseConfig"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import LogoHeader from "../components/LogoHeader"

export const Header = ({ colors, navigation }) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: colors.text, fontSize: 17 }}>Cancel</Text>
      </Pressable>
      <Text style={[styles.logo, { color: colors.text }]}>F</Text>
    </View>
  )
}
export const Title = ({ colors, title }) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={[styles.titleText, { color: colors.text }]}>{title}</Text>
    </View>
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
      <CheckIcon value={value} />
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
export const CheckIcon = ({ value }) => {
  const iconOpacity = useRef(new Animated.Value(0)).current
  const { colors } = useTheme()

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
export const CheckIconConfirm = ({ img }) => {
  const { colors } = useTheme()

  return (
    <Animated.View
      style={{
        position: "absolute",
        right: 0,
        bottom: img ? 28 : 30
      }}
    >
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
export const ConfirmInputElement = ({
  label,
  colors,
  value,
  setValue,
  placeholder,
  img,
  autoCapitalize
}) => {
  return (
    <View
      style={[
        styles.inputContainer,
        { marginTop: label === "User Image" && -10 }
      ]}
    >
      {!img && (
        <Animated.Text
          style={[
            styles.label,
            { top: -20, fontSize: 12, color: colors.faded }
          ]}
        >
          {label}
        </Animated.Text>
      )}
      <CheckIconConfirm />

      {placeholder && (
        <TextInput
          style={[
            styles.input,
            { borderBottomWidth: 1, borderColor: colors.border }
          ]}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={colors.faded}
          autoCapitalize={autoCapitalize}
        />
      )}
      {img && (
        <Image
          source={{ uri: img }}
          style={{ width: 40, height: 40, borderRadius: 50 }}
        />
      )}
    </View>
  )
}
const DobElement = ({ colors, label, value, setValue }) => {
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
      {!showPicker && <CheckIcon value={value} />}

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
            <Text style={[styles.buttonText, { color: colors.text }]}>
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
const ImageUploadComponent = ({ setUserImage, colors }) => {
  const [image, setImage] = useState(null)
  const [imageUploaded, setImageUploaded] = useState(false)

  const uploadImage = async () => {
    try {
      const response = await fetch(image)
      const blob = await response.blob()

      const data = new FormData()
      data.append("file", {
        uri: image,
        name: "photo.jpg",
        type: "image/jpeg"
      })
      data.append("upload_preset", "user_photos")

      await fetch("https://api.cloudinary.com/v1_1/cloud-x/image/upload", {
        method: "post",
        body: data
      })
        .then((res) => res.json())
        .then((data) => {
          setImageUploaded(true)
          setUserImage(data.secure_url)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (error) {
      console.error(error)
    }
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  return (
    <View style={{ width: "100%", marginTop: image ? -36 : -20 }}>
      {!image && (
        <Button
          title="Choose a photo"
          color={colors.primary}
          onPress={pickImage}
        />
      )}
      {image && (
        <View
          style={{
            alignItems: "center",
            marginTop: 20,
            flexDirection: "row",
            width: "100%",
            position: "relative"
          }}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.faded,
              marginRight: 12
            }}
            resizeMode="cover"
          />
          {image && !imageUploaded && (
            <TouchableOpacity onPress={uploadImage}>
              <Text style={{ color: colors.text }}>Upload</Text>
            </TouchableOpacity>
          )}
          {imageUploaded && <CheckIconConfirm img />}
        </View>
      )}
    </View>
  )
}
const Step1 = ({
  colors,
  name,
  setName,
  email,
  setEmail,
  dateOfBirth,
  setDateOfBirth,
  handleNext
}) => {
  const isButtonDisabled = name === "" || email === "" || dateOfBirth === ""
  return (
    <View style={styles.inputsContainer}>
      <Title colors={colors} title="Create your account" />
      <View style={{ flex: 1, gap: 40 }}>
        <InputElement
          label="Name"
          value={name}
          setValue={setName}
          colors={colors}
        />
        <InputElement
          label="Email"
          value={email}
          setValue={setEmail}
          colors={colors}
          autoCapitalize="none"
        />
        <DobElement
          colors={colors}
          label="Date of birth"
          value={dateOfBirth}
          setValue={setDateOfBirth}
        />
      </View>
      <TouchableOpacity
        onPress={handleNext}
        disabled={isButtonDisabled}
        style={[
          styles.nextButton,
          { color: colors.background, backgroundColor: colors.text },
          isButtonDisabled && styles.disabledButton
        ]}
      >
        <Text style={{ fontWeight: "700", color: colors.background }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  )
}
const Step2 = ({
  colors,
  username,
  setUsername,
  userImage,
  setUserImage,
  password,
  setPassword,
  handleNext,
  handlePrevious
}) => {
  const isButtonDisabled =
    username === "" || userImage === "" || password === ""
  return (
    <View style={styles.inputsContainer}>
      <Title colors={colors} title="Create your account" />
      <InputElement
        label="Username"
        value={username}
        setValue={setUsername}
        colors={colors}
        autoCapitalize={"none"}
      />
      <InputElement
        label="Password"
        secureTextEntry
        value={password}
        setValue={setPassword}
        colors={colors}
      />
      <ImageUploadComponent setUserImage={setUserImage} colors={colors} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "auto"
        }}
      >
        <TouchableOpacity
          onPress={handlePrevious}
          style={[
            styles.backButton,
            { color: colors.background, backgroundColor: colors.text }
          ]}
        >
          <Text style={{ fontWeight: "700", color: colors.background }}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={isButtonDisabled}
          style={[
            styles.nextButton,
            { color: colors.background, backgroundColor: colors.text },
            isButtonDisabled && styles.disabledButton
          ]}
        >
          <Text style={{ fontWeight: "700", color: colors.background }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const Step3 = ({
  colors,
  handlePrevious,
  handleSignUp,
  name,
  email,
  username,
  userImage
}) => {
  return (
    <View style={styles.inputsContainer}>
      <Title colors={colors} title="Confirm your account" />
      <ConfirmInputElement label="Name" colors={colors} placeholder={name} />
      <ConfirmInputElement
        label="Username"
        colors={colors}
        placeholder={username}
        autoCapitalize={"none"}
      />
      <ConfirmInputElement
        label="Email"
        colors={colors}
        placeholder={email}
        autoCapitalize={"none"}
      />
      <ConfirmInputElement label="User Image" colors={colors} img={userImage} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "auto"
        }}
      >
        <TouchableOpacity
          onPress={handlePrevious}
          style={[
            styles.backButton,
            { color: colors.background, backgroundColor: colors.text }
          ]}
        >
          <Text style={{ fontWeight: "700", color: colors.background }}>
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[
            styles.nextButton,
            { color: colors.background, backgroundColor: colors.primary }
          ]}
        >
          <Text style={{ fontWeight: "700", color: colors.background }}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [username, setUsername] = useState("")
  const [userImage, setUserImage] = useState("")
  const [password, setPassword] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const { colors } = useTheme()

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }
  const handleSignUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        setDoc(doc(db, "users", user.uid), {
          username: username,
          displayName: name,
          email: email,
          dateOfBirth: dateOfBirth,
          photoURL: userImage,
          createdAt: new Date().toUTCString()
        })
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: userImage
        })
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.container}>
            <LogoHeader colors={colors} navigation={navigation} text="Cancel" />
            <Step1
              colors={colors}
              handleSignUp={handleSignUp}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
              handleNext={handleNext}
            />
          </View>
        )
      case 1:
        return (
          <View style={styles.container}>
            <Header colors={colors} navigation={navigation} />
            <Step2
              colors={colors}
              username={username}
              setUsername={setUsername}
              userImage={userImage}
              setUserImage={setUserImage}
              password={password}
              setPassword={setPassword}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          </View>
        )
      case 2:
        return (
          <View style={styles.container}>
            <Header colors={colors} navigation={navigation} />
            <Step3
              colors={colors}
              handlePrevious={handlePrevious}
              handleSignUp={handleSignUp}
              name={name}
              username={username}
              userImage={userImage}
              email={email}
            />
          </View>
        )
      default:
        return <Text>Invalid step</Text>
    }
  }

  return <View style={styles.container}>{renderStep()}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "between",
    paddingHorizontal: 8,
    paddingVertical: 20
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    position: "relative"
  },
  logo: {
    fontSize: 32,
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -16 }, { translateY: -16 }],
    top: "50%"
  },
  titleText: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 13
  },
  nextButton: {
    width: "23%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 34,
    marginTop: "auto",
    marginBottom: 20,
    marginLeft: "auto"
  },
  backButton: {
    width: "23%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: 34,
    marginTop: "auto",
    marginBottom: 20,
    marginRight: "auto"
  },
  confirmButton: {
    height: 34
  },
  disabledButton: {
    backgroundColor: "gray"
  },
  inputsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 40,
    flex: 1
  },
  inputContainer: {
    position: "relative"
    // backgroundColor: "lightblue"
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
    color: "#639EFF",
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

export default SignUpScreen
