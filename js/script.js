import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  onSnapshot,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth,async (user) => {
  if (!user) {
    window.location.href = "userLogin.html";
  } else {
    document.getElementById("userName").textContent = user.email;
  }

  const roleDoc = await getDoc(doc(db, "users", user.uid));
  const role = roleDoc.data().role;

  if(window.location.pathname.includes("index") && role !== "user"){
    alert("Access Denied. You are not authorized to access this page.");
    window.location.href = "admin.html";
  }
});


let allProducts = [];

async function fetchProducts() {
  const section = document.querySelector(".product-section");
  if (!section) return;

  // Fetch from Firestore
  const snapshot = await getDocs(collection(db, "products"));
  const categorySet = new Set();

  snapshot.forEach((doc) => {
    const data = doc.data();
    const category = data.category ? data.category.toLowerCase() : "other";
    categorySet.add(category);

    allProducts.push({
      id: doc.id,
      name: data.name,
      price: parseFloat(data.price),
      image: data.imageUrl,
      category,
    });
  });

  populateCategoryFilter([...categorySet]);
  applyFilters();
}

function populateCategoryFilter(categories) {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  filter.innerHTML = '<option value="all">All</option>';

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    filter.appendChild(option);
  });
}

function applyFilters() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;
  const sortPrice = document.getElementById("sortPrice").value;

  let filtered = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchText)
  );

  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  if (sortPrice === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

function renderProducts(products) {
  const section = document.querySelector(".product-section");
  const noResult = document.getElementById("noResult");

  section.innerHTML = "";

  if (products.length === 0) {
    noResult.style.display = "block";
    return;
  }

  noResult.style.display = "none";

  // Render all cards
  products.forEach((product) => {
    section.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" style="width: 150px; height: 150px;" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="btn add-to-cart"
          data-name="${product.name}" 
          data-price="${product.price}" 
          data-image="${product.image}">
          Add to cart
        </button>
      </div>
    `;
  });

  // Attach listeners after DOM update
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const image = btn.dataset.image;

      addToCart({ name, price, image });
    });
  });
}


function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.name === product.name);

  if (existing) {
    existing.qty += 1;
  } else {
    product.qty = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateCartCount();

  document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);
  document
    .getElementById("categoryFilter")
    .addEventListener("change", applyFilters);
  document.getElementById("sortPrice").addEventListener("change", applyFilters);
});

import { signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "userLogin.html";
  });
};
