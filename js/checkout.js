// js/checkout.js
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth();
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "userLogin.html";
  } else {
    currentUser = user;
    displayCheckout();
  }
});

function displayCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("checkoutItems");
  const totalSpan = document.getElementById("checkoutTotal");

  let total = 0;
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalSpan.textContent = "0";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${item.image}" width="50" />
      <span>${item.name} (x${item.qty}) - ₹${item.price * item.qty}</span>
    `;
    container.appendChild(div);
    total += item.price * item.qty;
  });

  totalSpan.textContent = total.toFixed(2);
}

window.placeOrder = async function () {
  const address = document.getElementById("userAddress").value.trim();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  if (!address) {
    alert("Please enter your address.");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userId: currentUser.uid,
      email: currentUser.email,
      address: address,
      cart: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      createdAt: serverTimestamp(),
    });

    localStorage.removeItem("cart");
    alert("🎉 Order placed successfully!");
    window.location.href = "index.html";
  } catch (err) {
    alert("❌ Failed to place order: " + err.message);
  }
};

export async function saveOrder(cart, totalAmount) {
    try {
      const orderData = {
        userId: currentUser.uid,
        items: cart,
        totalAmount,
        createdAt: Timestamp.now(),
      };
  
      await addDoc(collection(db, "orders"), orderData);
      console.log("✅ Order saved to Firestore");
    } catch (error) {
      console.error("❌ Failed to save order:", error);
    }
  }

