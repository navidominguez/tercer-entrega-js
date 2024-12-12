class Producto {
    constructor(id = 0, nombre = "", precio = 0, imagenUrl = "") {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
    }
}

const cartItems = document.getElementById("cart-items");
const notification = document.getElementById("notification");
const totalPriceDisplay = document.getElementById("total-price");
const productList = document.getElementById("product-list");

const maxItems = 20; 
const ivaPercentage = 0.21; 


let productos = [
    new Producto(1, "Carrot cake", 11.00, "img/budin.jpg"),
    new Producto(2, "Pan integral", 15.00, "img/pan.jpg"),
    new Producto(3, "Donas Fit", 10.00, "img/donas.jpg"),
    new Producto(4, "Alfajores de avena", 15.00, "img/alf.jpg"),
    new Producto(5, "Cookies doble choco", 16.00, "img/galles.jpg"),
    new Producto(6, "Budin de banana y chips", 11.00, "img/budin2.jpg"),
    new Producto(7, "Galletitas de algarroba", 10.00, "img/g.jpg"),
    new Producto(8, "Cookies", 14.50, "img/cookies.jpg")
];


function generateProductCards(filteredProducts = productos) {
    productList.innerHTML = ''; 

    filteredProducts.forEach(producto => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${producto.imagenUrl}" alt="${producto.nombre}">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio.toFixed(2)}</p>
            <button onclick="addToCart(${producto.id}, '${producto.nombre}', ${producto.precio})">Añadir al carrito</button>
        `;

        productList.appendChild(productCard);
    });
}


function addToCart(id, name, price) {
    if (cartItems.children.length >= maxItems) {
        showNotification();
        return; 
    }

    const item = document.createElement("li");
    item.classList.add("cart-item");
    item.setAttribute("data-id", id);
    item.setAttribute("data-price", price);

    const itemContent = document.createElement("span");
    itemContent.textContent = `${name} - $${price}`;
    item.appendChild(itemContent);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.onclick = function () {
        confirmAndDeleteItem(item);
    };

    item.appendChild(deleteButton);
    cartItems.appendChild(item);

    updateTotal();
    updateCartCounter();
    hideNotificationIfNeeded();
}


function confirmAndDeleteItem(item) {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este producto del carrito?");
    if (confirmed) {
        cartItems.removeChild(item);
        updateTotal();
        updateCartCounter();
        hideNotificationIfNeeded();
    }
}

function clearCart() {
    const confirmed = confirm("¿Estás seguro de que deseas vaciar el carrito?");
    if (confirmed) {
        cartItems.innerHTML = "";
        updateTotal();
        updateCartCounter();
        hideNotification();
    }
}


function showNotification() {
    notification.classList.add("show");
}


function hideNotification() {
    notification.classList.remove("show");
}


function hideNotificationIfNeeded() {
    if (cartItems.children.length < maxItems) {
        hideNotification();
    }
}


function updateTotal() {
    let total = 0;

    Array.from(cartItems.children).forEach(item => {
        const price = parseFloat(item.getAttribute("data-price"));
        total += price;
    });

    const iva = total * ivaPercentage;
    const totalConIva = total + iva;

    totalPriceDisplay.innerHTML = `
        IVA: $${iva.toFixed(2)}<br>
        Total sin IVA: $${total.toFixed(2)}<br>
        Total con IVA (21%): $${totalConIva.toFixed(2)}
    `;
}


function updateCartCounter() {
    const cartCounter = document.getElementById("cart-counter");
    cartCounter.textContent = cartItems.children.length;
}


function searchProducts() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filteredProducts = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query)
    );

    generateProductCards(filteredProducts);
}


generateProductCards();