import firebase from 'firebase'
const firebaseapp = firebase.initializeApp({
    apiKey: "AIzaSyCMvTZV1k18qUaTSgtvmgyhFh_rfCC19i4",
    authDomain: "instagram-clone-e2880.firebaseapp.com",
    databaseURL: "https://instagram-clone-e2880.firebaseio.com",
    projectId: "instagram-clone-e2880",
    storageBucket: "instagram-clone-e2880.appspot.com",
    messagingSenderId: "781767630337",
    appId: "1:781767630337:web:eb942f9b07801e8354ea00",
    measurementId: "G-WE6DSPEERX"
  });

  const db = firebaseapp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage};