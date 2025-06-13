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
        <span>${item.name} (₹${item.price} x ${item.qty})</span>
        <button onclick="removeItem(${index})">Remove</button>
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
    const totalAmountSpan = document.getElementById("totalAmount");
    if (confirm("Confirm your purchase?")) {
      localStorage.removeItem("cart");
      totalAmountSpan.textContent = "0.00";
      alert("🎉 Purchase successful!");
      loadCart();
    }
  }    