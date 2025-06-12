window.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".product-section");

    if(!section){
        console.log("Section not found");
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];

    if(products.length == 0){
        section.innerHTML = "<p style='color:white;>no product found</p>";
        return;
    }

    section.innerHTML = "";

    products.forEach(product => {
        section.innerHTML += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button class="btn">Add to cart</button>
        </div>
        `;
    });
});