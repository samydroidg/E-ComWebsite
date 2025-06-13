// js/firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDAxLh_cQGdRwh9PSIM82E6-oV79R0nFw",
  authDomain: "e-comwebsite0.firebaseapp.com",
  projectId: "e-comwebsite0",
  storageBucket: "e-comwebsite0.firebasestorage.app",
  messagingSenderId: "634640797436",
  appId: "1:634640797436:web:10f880cdba166471095179",
  measurementId: "G-61F1HRQ81V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
