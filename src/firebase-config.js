import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, deleteDoc, query, where, getDocs, Timestamp, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, list, deleteObject } from "firebase/storage";
import { readAsStringAsync } from "expo-file-system";
import { FIREBASE_API_KEY } from "@env";

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
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


/*
  * getUserDoc returns the JSON object associated with a given user
  * @param user - user object, which can be retrieved using getUser()
  * @returns data {JSON Object} - returns the JSON object associated with a given user
*/
export async function getUserDoc(user) {
    if (user) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            //console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            setDoc(doc(db, "Users", user.uid), {
            });
            docSnap = await getDoc(docRef);
            //console.log(docSnap);
            return docSnap.data();
        }
    } else {
        return undefined;
    }
}


/*
  * getPostDoc returns the JSON object associated with a given post
  * @param postId - the string representing the ID of the post
  * @returns data {JSON Object} - returns the JSON object associated with a given post
*/
export async function getPostDoc(postId) {
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

/*
  * getPostIDs returns an array of IDs of all the posts stored in the database
  * @returns postIDs {array of strings} - returns an array of IDs of all the posts stored in the database
*/
export async function getPostIDs() {
    const docRef = doc(db, 'PostIDs', 'PostIDs');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data().IDs;
    } else {
        return undefined;
    }
}


/*
  * setUserDoc - updates the data associated with the user in the database
  * @param params - JSON object specifying the key value pairs to be updated in the DB
  * @param user - The user object of the currently logged in user
*/
export async function setUserDoc(params, user) {
    if (user) {
        setDoc(doc(db, "Users", user.uid), params, { merge: true });
    }
}


/*
  * setPostDoc - updates the data associated with the post in the database
  * @param params - JSON object specifying the key value pairs to be updated in the DB
  * @param postId - The postID
*/
export async function setPostDoc(params, postId) {
    //console.log(postId);
    setDoc(doc(db, "Posts", postId), params, { merge: true });
}


/*
  * uploadPostToDB - uploades the post to the databse and initialises some of the relevant fields, such as Upvoters, Upvotes, UID of the user who posted, the timestamp and the UID of the Post
  * @param params - JSON object specifying the key value pairs to be uploaded in the DB for the post
  * @param user - The user object of the currently logged in user
*/
export async function uploadPostToDB(postJSON, user) {
    if (user) {
        const userDoc = await getUserDoc(user);

        postJSON.userUID = user.uid;
        postJSON.Upvotes = 0;
        postJSON.Upvoters = [];
        postJSON.Timestamp = Timestamp.now();
        let userPostData = userDoc.Posts;
        let postRef = await addDoc(collection(db, 'Posts'), postJSON);
        if (!userPostData) userPostData = [];
        userPostData.push(postRef.id);
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


/*
  * getUser - returns the object specifying the currently logged in user
  * @returns user {JSON object} - the object specifying the currently logged in user
*/
export async function getUser() {
    return FirebaseAuth.currentUser;
}

/*
  * togglePostUpvote - Upvotes/removes the upvote from a given post and updates the DB
  * @param postId - The postID
  * @param user - The user object of the currently logged in user
*/
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
  * deletePost - Removes the post from the DB and ensures the consistency of the state of the DB
  * @param postId - The postID
  * @param user - The user object of the currently logged in user. The user must be the one to have uploaded the post in the first place.
*/
export async function deletePost(postId, user) {
    if (user) {
        const userDoc = await getUserDoc(user);
        let postIDs = await getPostIDs();
        postIDs = postIDs.filter(e => e !== postId);
        let userPosts = userDoc.Posts;
        let userUpvotedPosts = userDoc.upvotedPosts;
        if (userPosts.includes(postId)) {
            userPosts = userPosts.filter(e => e !== postId);
            userUpvotedPosts = userUpvotedPosts.filter(e => e !== postId);
            setUserDoc({ 'Posts': userPosts }, user);
            setUserDoc({ 'upvotedPosts': userUpvotedPosts }, user);
            setDoc(doc(db, "PostIDs", 'PostIDs'), { 'IDs': postIDs }, { merge: true });
            deleteDoc(doc(db, "Posts", postId));

            const folderRef = ref(ref(FirebaseStorage), 'PostFiles/' + user.uid + '/' + postId);
            const listResult = await listAll(folderRef);
            for (const file of listResult.items) {
                deleteObject(file);
            }
        }
    }
}

/*
  * snapshotToArray - translates a query to an array of JSON objects representing posts
  * @param q - the query
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
async function snapshotToArray(q) {
    const querySnapshot = await getDocs(q);
    let postsArray = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        postsArray.push(doc.data());
    });
    return postsArray;
}

/*
  * snapshotToArrayCoordinates - translates a query by coordinates to an array of JSON objects representing posts
  * @param q - the query
  * @param longitude - the longitude for the coordinates
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
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

/*
  * getPostsByLocation - returns the posts searched by the location given
  * @param location - the location with which to search
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
export async function getPostsByLocation(location, limitVal = 100, orderByUpvotes = false) {
    queries = [
        { attributeName: 'location', operator: '==', attributeValue: location }
    ]
    return getPostsByAttributes(queries, limitVal, orderByUpvotes);
}

/*
  * getTopPosts - returns the top posts to display to the user
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
export async function getTopPosts(limitVal = 100, orderByUpvotes = false) {
    return getPostsByAttributes([], limitVal, orderByUpvotes);
}

/*
  * getPostsByTitle - returns the posts searched by the title given
  * @param title - the title with which to search
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
export async function getPostsByTitle(title, limitVal = 100, orderByUpvotes = false) {
    queries = [
        { attributeName: 'title', operator: '==', attributeValue: title }
    ]
    return getPostsByAttributes(queries, limitVal, orderByUpvotes);
}

/*
  * getPostsByUserUID - returns the posts searched by the user UID given
  * @param uid - the uid with which to search
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
export async function getPostsByUserUID(uid, limitVal = 100, orderByUpvotes = false) {
    queries = [
        { attributeName: 'userUID', operator: '==', attributeValue: uid }
    ]
    return getPostsByAttributes(queries, limitVal, orderByUpvotes);
}

/*
  * getPostsByTag - returns the posts searched by the tag given
  * @param tag - the tag with which to search
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
export async function getPostsByTag(tag, limitVal = 100, orderByUpvotes = false) {
    queries = [
        { attributeName: 'tags', operator: 'array-contains', attributeValue: tag.toLowerCase() }
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

/*
  * getPostsByCoordinates - returns the posts searched by the coordinates given
  * @param coordinates - the coordinates with which to search
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
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


/*
  * getPostsByusername - returns the posts searched by the username of the creator given
  * @param username - the username with which to search
  * @param orderByUpvotes - specifies whether to order by upvotes
  * @param limitVal - specifies how many posts to return
  * @return postsArray {array of JSON objects} - the objects representing the relevant posts
*/
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
/*
  * uploadFilesToDB - uploads files onto firebase cloud storage at location PostFiles/{userId}/{postId}
  * @param files - an array of file objects, all of which contain the fields name, type & uri
  * @param postId - the id of the post associated with the file upload
  * @param userId - the id of the user which posted the file
  * @return void
*/
export async function uploadFilesToDB(files, postId, userId) {
    const folderRef = ref(ref(FirebaseStorage), 'PostFiles/' + userId + '/' + postId);
    for (const file of files) {
        const imgRef = ref(folderRef, file.name);
        const metadata = {
            contentType: file.type,
        }
        const fileBlob = await (await fetch(file.uri)).blob();
        uploadBytesResumable(imgRef, fileBlob, metadata);
    }
}

//returns array downloadurl for now (as a string)
// need to have limit on size of number of files uploaded, otherwise listAll consumes too many resources
/*
  * getFilesForPost - returns the files from a specific post
  * @param postId - the id of the post associated with the file upload
  * @param userId - the id of the user which posted the file
  * @return fileURLs {array of download URLs} - the URLs used to download the files onto the app
*/
export async function getFilesForPost(postId, userId) {
    const folderRef = ref(ref(FirebaseStorage), 'PostFiles/' + userId + '/' + postId);

    var fileURLs = [];
    const listResult = await listAll(folderRef);
    for (const file of listResult.items) {
        fileURLs.push(await getDownloadURL(file));
    }
    return fileURLs;
}