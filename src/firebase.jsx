// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
//import { getFirestore } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmmN0ZeZi02Fqh_n7arE5CU7djfaUMSnQ",
  authDomain: "ordemdeservicovima.firebaseapp.com",
  projectId: "ordemdeservicovima",
  storageBucket: "ordemdeservicovima.appspot.com",
  messagingSenderId: "44544350000",
  appId: "1:44544350000:web:87df70823bbc2f599e5af5",
  measurementId: "G-0ZLXNJ4V51"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

