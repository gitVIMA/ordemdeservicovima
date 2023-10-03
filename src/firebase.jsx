import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCmmN0ZeZi02Fqh_n7arE5CU7djfaUMSnQ",
  authDomain: "ordemdeservicovima.firebaseapp.com",
  projectId: "ordemdeservicovima",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

