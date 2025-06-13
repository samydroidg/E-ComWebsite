import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCDAxLh_cQGdRwh9PSIM82E6-oV79R0nFw",
  authDomain: "e-comwebsite0.firebaseapp.com",
  projectId: "e-comwebsite0",
  storageBucket: "e-comwebsite0.appspot.com",
  messagingSenderId: "634640797436",
  appId: "1:634640797436:web:10f880cdba166471095179",
  measurementId: "G-61F1HRQ81V",
};

// ✅ Init Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Login Form Logic
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    // ✅ Fetch role from Firestore
    const roleDoc = await getDoc(doc(db, "users", user.uid));
    const role = roleDoc.data()?.role;

    if (role === "admin") {
      localStorage.setItem("role", "admin");
      window.location.href = "admin.html";
    } else if (role === "user") {
      localStorage.setItem("role", "user");
      window.location.href = "index.html";
    } else {
      errorMsg.textContent = "❌ Invalid role. Access denied.";
    }
  } catch (error) {
    errorMsg.textContent = "❌ Login failed: " + error.message;
  }
});
