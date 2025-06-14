import { db } from "./firebase-config.js";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "userLogin.html";
  } else {
    fetchOrders(user.uid);
  }
});

async function fetchOrders(userId) {
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "Loading...";

  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    orderList.innerHTML = "<p>No orders found.</p>";
    return;
  }

  orderList.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const date = data.createdAt.toDate().toLocaleString();

    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order-card");

    orderDiv.innerHTML = `
      <h3>Order on ${date}</h3>
      <p><strong>Total:</strong> ₹${(data.total || 0).toFixed(2)}</p>
      <ul>
        ${(data.cart || [])
          .map(
            (item) =>
              `<li>${item.name} - ₹${item.price} × ${item.qty}</li>`
          )
          .join("")}
      </ul>
      <hr />
    `;

    orderList.appendChild(orderDiv);
  });
}
