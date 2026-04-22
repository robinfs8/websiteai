import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZd9axVriqld7iy_JqieVAIAXCIznMQ1c",
  authDomain: "landingpage-ai.firebaseapp.com",
  projectId: "landingpage-ai",
  storageBucket: "landingpage-ai.firebasestorage.app",
  messagingSenderId: "356382946644",
  appId: "1:356382946644:web:2f821ba2f61b4033bec4c1",
  measurementId: "G-GN6LN7ZJMZ",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

analyticsSupported().then((ok) => {
  if (ok) getAnalytics(app);
});
