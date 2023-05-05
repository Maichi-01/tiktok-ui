import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, setDoc } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";

const firebaseConfig = { 
  apiKey : "AIzaSyCR-BSEN-bKvDOf_kw28CksbbxtpdTHOws" , 
  authDomain : "tiktok-ui-8c2bb.firebaseapp.com" , 
  projectId : "tiktok-ui-8c2bb" , 
  storageBucket : "tiktok-ui-8c2bb.appspot.com" , 
  messagingSenderId : "924023723596" , 
  appId : "1:924023723596:web:6f76604f1391118d5a46e9" , 
  measurementId : "G-9VHFYQJLXJ" 
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage();
export const firestore = getFirestore();

export const analytics = getAnalytics(app);

export function useAuth() {
  const [currentUser, seCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => seCurrentUser(user));
    return unsub;
  }, [])
  return currentUser;

}



// storage
export async function updateProfileUser(file, currentUser, loading, nameUser) {

  const fileRef = ref(storage, `images/${currentUser.uid}${file.name}`);


  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, {
    photoURL: photoURL,
    displayName: nameUser,
  });

  const dataUser = {
    displayName: nameUser,
    email: currentUser.email,
    photoURL: photoURL,
    uid: currentUser.uid
  }
  console.log(dataUser, 'dataUser')


  addUsertoDB(dataUser)



}

export async function uploadVideo(file, setLoading) {
  const fileRef = ref(storage, `videos/${file.name}${Math.random()} `);
  setLoading(true);
  const snapshot = await uploadBytes(fileRef, file);
  const urlVideo = await getDownloadURL(fileRef);

  setLoading(false);
  return urlVideo;
}

const postVideos = collection(firestore, "postVideo");


// upload Video 

export async function writeUpdateVideo(fileUpdate) {
  const docData = fileUpdate;
  try {

    await addDoc(postVideos, docData);
    console.log('upload video thanh cong')
  }
  catch (error) {
    console.log('co loi', error)
  }

}


// add user new to db
const userList = collection(firestore, "Users");

export async function addUsertoDB(user) {
  const docUser = user;
  try {
    await setDoc(doc(db, "Users", `${user.uid}`), {
      user
    });
    console.log('add người dùng thành công')

  }
  catch (error) {
    console.log('co loi', error)
  }
}


export default app;

