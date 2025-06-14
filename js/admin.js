// ✅ Firebase Imports
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  doc,
  getDoc,      // ✅ Add this line
  updateDoc,
  deleteDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Initialize Firebase Auth
const auth = getAuth();

// ✅ Check Admin Authentication
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "userLogin.html";
    return;
  }

  const roleDoc = await getDoc(doc(db, "users", user.uid));
  const role = roleDoc.data()?.role;

  if (role !== "admin") {
    alert("Access Denied. You are not authorized to access this page.");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("userName").textContent = user.email;
  loadAdminProducts(); // ✅ Only load after role is confirmed
});


// ✅ Logout Function
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "adminLogin.html";
    })
    .catch(error => {
      console.error("Logout error:", error);
    });
};

// ✅ Add Product Form
const form = document.getElementById('productForm');
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const image = document.getElementById('productImage').value.trim();
    const category = document.getElementById("categories").value;

    if (!name || !price || !image || !category) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        price,
        imageUrl: image,
        category
      });
      form.reset();
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  });
}

// ✅ Load and Render Products
function loadAdminProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;

  onSnapshot(collection(db, "products"), snapshot => {
    productList.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.name}</td>
        <td>₹${data.price}</td>
        <td><img src="${data.imageUrl}" alt="${data.name}" width="50" height="50" /></td>
        <td>${data.category}</td>
        <td>
          <button onclick="editProduct('${docSnap.id}', '${data.name}', '${data.price}', '${data.imageUrl}', '${data.category}')" class="btn productBtn">Edit</button>
          <button onclick="deleteProduct('${docSnap.id}')" class="btn productBtn">Delete</button>
        </td>
      `;

      productList.appendChild(row);
    });
  });
}

document.addEventListener("DOMContentLoaded", loadAdminProducts);

// ✅ Edit Product
window.editProduct = async function (id, name, price, imageUrl, category) {
  const newName = prompt("Enter new name:", name);
  const newPrice = prompt("Enter new price:", price);
  const newImage = prompt("Enter new image URL:", imageUrl);
  const newCategory = prompt("Enter new category:", category);

  if (newName && newPrice && newImage && newCategory) {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        name: newName.trim(),
        price: newPrice,
        imageUrl: newImage.trim(),
        category: newCategory.trim().toLowerCase()
      });
      alert("✅ Product updated!");
    } catch (e) {
      console.error("Update failed:", e);
    }
  }
};

// ✅ Delete Product
window.deleteProduct = async function (id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  }
};

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "userLogin.html";
  });
};
