// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
//import { getFirestore } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3zKreqLGDz_3VWxtGTs6qCoEBcXkdRXU",
  authDomain: "nodal-magnet-377017.firebaseapp.com",
  projectId: "nodal-magnet-377017",
  storageBucket: "nodal-magnet-377017.appspot.com",
  messagingSenderId: "455282784883",
  appId: "1:455282784883:web:988a8875ca076e6cffc806",
  measurementId: "G-881X44RTJJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };