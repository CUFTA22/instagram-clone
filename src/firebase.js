import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAXDDsQ_53YXiMiL0WVRzggmlpGbz6OnGk",
  authDomain: "social1-294e2.firebaseapp.com",
  databaseURL: "https://social1-294e2.firebaseio.com",
  projectId: "social1-294e2",
  storageBucket: "social1-294e2.appspot.com",
  messagingSenderId: "670665972492",
  appId: "1:670665972492:web:6ed6ec58277500d0628729",
  measurementId: "G-80LTBNGGR6",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
