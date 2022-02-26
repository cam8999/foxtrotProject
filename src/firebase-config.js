import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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
export const db = getFirestore();

export async function getUserDoc(user) {            //If a user object is provided it will return the corresponding data snap.
    if (user) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap;
        } else {
            setDoc(doc(db, "Users", user.uid), {
            });
            docSnap = await getDoc(docRef);
            console.log(docSnap);
            return docSnap;
        }
    } else {
        return undefined;
    }
}

export async function setUserDoc(user, params) {
    if (user) {
        setDoc(doc(db, "Users", user.uid), params, { merge: true });
    }
}