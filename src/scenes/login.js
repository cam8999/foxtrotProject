import React, { useState, useRef, useEffect } from 'react';;
import { Text, View, TouchableOpacity, TextInput, Button } from 'react-native';

import { initializeApp } from "firebase/app";
import { PhoneAuthProvider, getAuth, signInWithCredential } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

const firebaseConfig = {
  apiKey: "AIzaSyDyFygporWON-sAA5rJ17xbiTXi-vJhtm8",
  authDomain: "foxtrotproject-678f5.firebaseapp.com",
  projectId: "foxtrotproject-678f5",
  storageBucket: "foxtrotproject-678f5.appspot.com",
  messagingSenderId: "698723331692",
  appId: "1:698723331692:web:5279b9249b96148331f249",
  databaseURL: "https://foxtrotproject-678f5-default-rtdb.europe-west1.firebasedatabase.app/"
};


export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getDatabase(FirebaseApp);


function LoginScreen({ navigation }) {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('')
  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    if (recaptchaVerifier.current === null) {
      return;
    }
    const phoneProvider = new PhoneAuthProvider(FirebaseAuth);
    const _verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier.current
    );
    setVerificationId(_verificationId);
  }

  async function confirmCode() {
    const userCredential = await signInWithCredential(
      FirebaseAuth,
      PhoneAuthProvider.credential(verificationId, code)
    );
    console.log(userCredential);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View nativeId="recap"></View>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={FirebaseApp.options}
        attemptInvisibleVerification={true}
      />

      {/* Phone Number Input */}
      <TextInput
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCompleteType="tel"
      />

      <TouchableOpacity nativeId="recaptcha" onPress={() => signInWithPhoneNumber(phoneNumber)}>
        <Text>Send Verification</Text>
      </TouchableOpacity>
      {/* Verification Code Input */}
      <TextInput
        placeholder="Confirmation Code"
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      <TouchableOpacity onPress={confirmCode}>
        <Text>Send Verification</Text>
      </TouchableOpacity>

    </View>
  )
}

export default LoginScreen;