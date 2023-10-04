// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCmmN0ZeZi02Fqh_n7arE5CU7djfaUMSnQ",
  authDomain: "ordemdeservicovima.firebaseapp.com",
  projectId: "ordemdeservicovima",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

