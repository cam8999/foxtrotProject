import React, { useState, useRef } from 'react';
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { Text, View, TextInput, Pressable } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

import { FirebaseApp, FirebaseAuth } from '../firebase-config';
import { AppStyle } from '../styles';


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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", margin: 15, }}>
      <View nativeId="recap"></View>
      {/* <Button onPress={checkSignInStatus} title="Check Sign In">Check sign in</Button> */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={FirebaseApp.options}
        attemptInvisibleVerification={true}
      />

      <View style={AppStyle.loginContainer}>
        <Text style={[AppStyle.title, {padding: 10}]}>Sign In</Text>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholder="Phone Number"
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCompleteType="tel"
            style={[AppStyle.textInput, {flex: 3}]}
          />
          <Pressable style={AppStyle.button} onPress={() => signInWithPhoneNumber(phoneNumber)}>
            <Text style={AppStyle.buttonTitle}>Send Verification</Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            placeholder="Confirmation Code"
            onChangeText={setCode}
            keyboardType="number-pad"
            style={[AppStyle.textInput, {flex: 2}]}
          />
          <Pressable style={AppStyle.button} onPress={confirmCode}>
            <Text style={AppStyle.buttonTitle}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default LoginScreen;