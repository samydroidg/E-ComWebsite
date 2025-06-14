import { saveOrder } from "./checkout.js";

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsDiv = document.getElementById("cartItems");
  const totalAmountSpan = document.getElementById("totalAmount");

  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>No items in cart.</p>";
    totalAmountSpan.textContent = "0"; // ✅ Set total to 0
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.innerHTML = `
        <img src="${item.image}" width="50" height="50" />
        <span>${item.name} (₹${item.price} x 
          <button onclick="changeQty(${index}, -1)" class="btn cartBtn" style="padding: 0; width: 20px; height: 20px;">-</button>
          ${item.qty}
          <button onclick="changeQty(${index}, 1)" class="btn cartBtn" style="padding: 0; width: 20px; height: 20px;">+</button>
        )</span>
        <button onclick="removeItem(${index})" class="btn cartBtn">Remove</button>
      `;
    cartItemsDiv.appendChild(itemDiv);

    total += item.price * item.qty;
  });

  totalAmountSpan.textContent = total.toFixed(2);
}

function removeItem(index) {
  const totalAmountSpan = document.getElementById("totalAmount");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

document.addEventListener("DOMContentLoaded", loadCart);

function checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const totalAmountSpan = document.getElementById("totalAmount");
  if (confirm("Confirm your purchase?")) {
    // localStorage.removeItem("cart");
    saveOrder(cart, totalAmount);
    totalAmountSpan.textContent = "0.00";
    loadCart();
    window.location.href = "checkout.html";
  }
}

function changeQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

window.checkout = checkout;
window.changeQty = changeQty;
window.removeItem = removeItem;
