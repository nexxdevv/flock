import { initializeApp } from "firebase/app"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD0B0CHWF4CSpSo773RLHiHMToGmKoAjZ0",
  authDomain: "flock-ddb98.firebaseapp.com",
  projectId: "flock-ddb98",
  storageBucket: "flock-ddb98.appspot.com",
  messagingSenderId: "641202743223",
  appId: "1:641202743223:web:116afb587420f9ee6daa32"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
