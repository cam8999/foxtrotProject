//import { FirebaseApp } from "./firebase-config";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { readFile } from "fs/promises";
import { v4 as generateRandomId } from 'uuid';
import { fileTypeFromBuffer } from 'file-type';

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
export const FirebaseStorage = getStorage(FirebaseApp);

const proofOfConceptRef = ref(ref(FirebaseStorage), 'ProofOfConcept');

// npm installed uuid, remember to remove if not used
// generateRandomId() generates UUID
async function uploadFile(filepath, postId) { // need to figure out how image and videos are uploaded
    const imgTitle = generateRandomId(); //not checking duplicates occur as it costs per check & chance is extremely low.
    const byteArray = await readFile(filepath);
    const fileExtension = await fileTypeFromBuffer(byteArray);
    const imgRef = ref(proofOfConceptRef, imgTitle + '.' + fileExtension.ext);
    const metadata = {
        contentType: fileExtension.mime,
    }
    const uploadTask = uploadBytesResumable(imgRef, byteArray, metadata) // TODO: add metadata of image
    
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            } 
        },
        (error) => {
            // unsuccessful upload
            // TODO: handle unsuccessful upload
        },
        () => {
            // successful upload
            // TODO: add to JSON object
        }
    ); 
}
