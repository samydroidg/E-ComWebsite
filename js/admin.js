document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").value;

    const product = {name, price, image};

    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    alert("Product added successfully!");
    this.reset();
});

if(localStorage.getItem("loggedIn") !== "true"){
    window.location.href = "adminLogin.html";
}

function logout(){
    localStorage.removeItem("loggedIn");
    window.location.href = "adminLogin.html";
}

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
});