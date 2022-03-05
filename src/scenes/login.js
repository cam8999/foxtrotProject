import React, { useState, useRef} from 'react';;
import { Text, View, TouchableOpacity, TextInput} from 'react-native';

import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

import { FirebaseApp, FirebaseAuth} from '../firebase-config';


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
    try {
      const userCredential = await signInWithCredential(
        FirebaseAuth,
        PhoneAuthProvider.credential(verificationId, code)
      );
      navigation.navigate('Home');
    } catch (error) {
      console.log("Invalid code");
    }

    //console.log(userCredential);
    //checkSignInStatus();
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View nativeId="recap"></View>
      {/* <Button onPress={checkSignInStatus} title="Check Sign In">Check sign in</Button> */}
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