import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, deleteDoc, query, where, getDocs, Timestamp, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, list } from "firebase/storage";
import { readAsStringAsync } from "expo-file-system";

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
    if (postId) {
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

export async function getPostIDs() {
    const docRef = doc(db, 'PostIDs', 'PostIDs');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        return docSnap.data().IDs;
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
        postJSON.Timestamp = Timestamp.now();
        let userPostData = userDoc.Posts;
        let postRef = await addDoc(collection(db, 'Posts'), postJSON);
        if (!userPostData) userPostData = [];
        userPostData.push(postRef.id);
        console.log("Upload logs");
        console.log(userPostData);
        setUserDoc({ 'Posts': userPostData }, user);
        postIDs = await getPostIDs();
        if (!postIDs) postIDs = [];
        postIDs.push(postRef.id);
        setDoc(doc(db, "PostIDs", 'PostIDs'), { 'IDs': postIDs }, { merge: true });
        setPostDoc({ 'ID': postRef.id }, postRef.id);
        return postRef.id;
    }
    throw 'User is not logged in!';
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


export async function deletePost(postId, user) {
    if (user) {
        const userDoc = await getUserDoc(user);
        let postIDs = await getPostIDs();
        postIDs = postIDs.filter(e => e !== postId);
        let userPosts = userDoc.Posts;
        if (userPosts.includes(postId)) {
            userPosts = userPosts.filter(e => e !== postId);
            setUserDoc({ 'Posts': userPosts }, user);
            setDoc(doc(db, "PostIDs", 'PostIDs'), { 'IDs': postIDs }, { merge: true });
            deleteDoc(doc(db, "Posts", postId));
        }
    }
}


async function snapshotToArray(q) {
    const querySnapshot = await getDocs(q);
    let postsArray = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        postsArray.push(doc.data());
    });
    console.log(postsArray[0]);
    return postsArray;
}


async function snapshotToArrayCoordinates(q, longitude, orderByUpvotes, limitVal) {
    const querySnapshot = await getDocs(q);
    let postsArray = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().Longitude >= longitude - 1 / 3 && doc.data().Longitude <= longitude + 1 / 3) {
            postsArray.push(doc.data());
        }
    });
    if (orderByUpvotes) {
        postsArray.sort(function (a, b) {
            return b.Upvotes - a.Upvotes;
        });
    } else {
        postsArray.sort(function (a, b) {
            return (b.Timestamp.seconds - a.Timestamp.seconds);
        });
    }
    if (postsArray.length > limitVal + 1) {
        return postsArray.slice(0, limitVal);
    } else {
        return postsArray;
    }
}


export async function getPostsByLocation(location, limitVal = 100, orderByUpvotes = false) {
    queries = [
        {attributeName: 'location', operator: '==', attributeValue: location}
    ]
    return getPostsByAttributes(queries, limitVal, orderByUpvotes);
}


export async function getTopPosts(limitVal = 100, orderByUpvotes = false) {
    return getPostsByAttributes([], limitVal, orderByUpvotes);
}


export async function getPostsByTitle(title, limitVal = 100, orderByUpvotes = false) {
    console.log("getPostsByTitle - searching for " + title);
    queries = [
        {attributeName: 'title', operator: '==', attributeValue: title}
    ]
    return getPostsByAttributes(queries, limitVal, orderByUpvotes);
}


export async function getPostsByUserUID(uid, limitVal = 100, orderByUpvotes = false) {
    queries = [
        {attributeName: 'userUID', operator: '==', attributeValue: uid}
    ]
    return getPostsByAttributes(queries, limitVal, orderByUpvotes);
}


export async function getPostsByTag(tag, limitVal = 100, orderByUpvotes = false) {
    queries = [
        {attributeName: 'tags', operator: 'array-contains', attributeValue: tag}
    ]
    return getPostsByAttributes(queries, limitVal, orderByUpvotes);
}

/* 
 * Returns an array of posts satisfying the given queries.
 * @param attributeQueries - an array of { attributeName, operator, attributeValue } object queries
 */
async function getPostsByAttributes(attributeQueries, limitVal, orderByUpvotes) {
    console.log("getPostsByAttributes - getting posts from DB.");
    let parameters = [collection(db, "Posts")];
    for (const q of attributeQueries) {
        parameters.push(where(q.attributeName, q.operator, q.attributeValue));
    }
    if (orderByUpvotes) parameters.push(orderBy('Upvotes', 'desc'));
    else parameters.push(orderBy('Timestamp', 'desc'));
    parameters.push(limit(limitVal));

    let q = query(...parameters);
    let queriedPosts = await snapshotToArray(q);
    console.log("getPostsByAttributes - returning posts");
    return queriedPosts;
}


export async function getPostsByCoordinates(coordinates, limitVal = 100, orderByUpvotes = false) {
    let q;
    let latitude = coordinates.Latitude;
    let longitude = coordinates.Longitude;
    if (!orderByUpvotes) {
        q = query(collection(db, "Posts"), where("Latitude", ">=", latitude - 1 / 6), where("Latitude", "<=", latitude + 1 / 6));

    } else {
        q = query(collection(db, "Posts"), where("Latitude", ">=", latitude - 1 / 6), where("Latitude", "<=", latitude + 1 / 6));

    }
    return snapshotToArrayCoordinates(q, longitude, orderByUpvotes, limitVal);
}

export async function getPostsByUsername(username, limitVal = 100, orderByUpvotes = false) {
    let userQuery = query(collection(db, "Users"), where("Username", "==", username), limit(1));
    const querySnapshot = await getDocs(userQuery);
    let userUID = "";
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        userUID = doc.id;
    });
    let q;
    if (!orderByUpvotes) {
        q = query(collection(db, "Posts"), where("userUID", "==", userUID), orderBy('Timestamp', 'desc'), limit(limitVal));
    } else {
        q = query(collection(db, "Posts"), where("userUID", "==", userUID), orderBy('Upvotes', 'desc'), limit(limitVal));
    }
    return snapshotToArray(q);
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

export async function uploadFilesToDB(files, postId, userId) {
    const folderRef = ref(ref(FirebaseStorage), 'PostFiles/' + userId + '/' + postId);
    for (const file of files) {
        const imgRef = ref(folderRef, file.name);
        const metadata = {
            contentType: file.type,
        }
        const fileBlob = await (await fetch(file.uri)).blob();
        const uploadTask = uploadBytesResumable(imgRef, fileBlob, metadata);
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
        // TODO: Deal with file not uploading (do it at form or in )
        uploadTask.catch(console.log("Error: file cannot be added to the server right now. Please try again shortly."));

    }
}

//returns array downloadurl for now (as a string)
// need to have limit on size of number of files uploaded, otherwise listAll consumes too many resources
export async function getFilesForPost(postId, userId) {
    const folderRef = ref(ref(FirebaseStorage), 'PostFiles/' + userId + '/' + postId);
    var fileUrls = [];
    const listResult = await listAll(folderRef);
    for (file of listResult) fileUrls.push(await getDownloadURL(file));
    return listResult;
}