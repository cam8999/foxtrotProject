import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, list } from "firebase/storage";
import { readFile } from "fs/promises";

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
export const FirebaseStorage = getStorage(FirebaseApp);

export async function getUserDoc(user) {            //If a user object is provided it will return the corresponding data.
    if (user) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            setDoc(doc(db, "Users", user.uid), {
            });
            docSnap = await getDoc(docRef);
            console.log(docSnap);
            return docSnap.data();
        }
    } else {
        return undefined;
    }
}

export async function getPostDoc(postId) {            //If a post id is provided it will return the corresponding data.
    if (user) {
        const docRef = doc(db, 'Posts', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

export async function setUserDoc(params, user) {
    if (user) {
        setDoc(doc(db, "Users", user.uid), params, { merge: true });
    }
}

export async function setPostDoc(params, postId) {
    console.log(postId);
    setDoc(doc(db, "Posts", postId), params, { merge: true });
}

export async function uploadPostToDB(postJSON, user) {
    if (user) {
        const userDoc = await getUserDoc(user);

        postJSON.userUID = user.uid;
        postJSON.Upvotes = 0;
        postJSON.Upvoters = 0;
        let userPostData = userDoc.Posts;
        let postRef = await addDoc(collection(db, 'Posts'), postJSON);
        if (!userPostData) userPostData = []
        userPostData.push(postRef.id);
        console.log("Upload logs");
        console.log(userPostData);
        setUserDoc({ 'Posts': userPostData }, user);
    }
}

export async function getUser() {
    return FirebaseAuth.currentUser;
}

export async function togglePostUpvote(postId, user) {
    const userDoc = await getUserDoc(user);
    const postDoc = await getPostDoc(postId);
    let upvotedPosts = userDoc.upvotedPosts;
    let upvoters = postDoc.Upvoters;
    let upvotes = postDoc.Upvotes;
    if (!upvotedPosts) upvotedPosts = [];
    if (!upvoters) upvoters = [];
    if (!upvotes) upvotes = 0;
    let postUpvoted = upvotedPosts.includes(postId);
    if (!postUpvoted) {
        upvotedPosts.push(postId);
        upvoters.push(user.uid);
        upvotes += 1;
    } else {
        upvotedPosts = upvotedPosts.filter(e => e !== postId);
        upvoters = upvoters.filter(e => e !== user.uid);
        upvotes -= 1;
    }
    setUserDoc({ 'upvotedPosts': upvotedPosts }, user);
    setPostDoc({ 'Upvoters': upvoters, 'Upvotes': upvotes }, postId);
}

/* 
{
  files:
    [{
      name: "",
      type: "",
      uri: "",
    },]
}
*/

export async function uploadFilesToDB(files, postId) {
    const folderRef = ref(ref(FirebaseStorage),'PostFiles/' + postId);
    files.forEach(file => {
        const imgRef = ref(folderRef, file.name);
        const metadata = {
            contentType: files.type,
        }
        const byteArray = await readFile(files.uri);
        uploadBytesResumable(imgRef, byteArray, metadata);
    });
}

//returns array downloadurl for now (as a string)
// need to have limit on size of number of files uploaded, otherwise listAll consumes too many resources
export async function getFilesForPost(postId) {
    const folderRef = ref(ref(FirebaseStorage),'PostFiles/' + postId);
    var fileUrls = [];
    const listResult = await listAll(folderRef);
    listResult.items.forEach(file => fileUrls.push(await getDownloadURL(file)));
    return listResult;
}