const availableItems = [
    { name: 'MacBook Pro', price: 53890.99, image: 'images/laptop.png' },
    { name: 'Iphone 15 Pro Max', price: 70450.99, image: 'images/smartphone.png' },
    { name: 'Studiomaster Headphone', price: 5999.99, image: 'images/headphone.png' },
    { name: 'Ergonomic Keyboard', price: 1290.99, image: 'images/keyboard.png' },
    { name: 'Gaming Mouse', price: 780.99, image: 'images/mouse.png' },
    { name: '120watt Dart Charger', price: 550.99, image: 'images/charger.png'},
    { name: '2 TB Samsung SD Card', price: 308.99, image: 'images/sd.png'},
    { name: 'DX Racer Gaming chair', price: 4580.99, image: 'images/chair.png'},
    { name: 'RGB Strip Lights', price: 50.99, image: 'images/rgb.png'},
    { name: 'JBL Portable Speaker', price: 238.99, image: 'images/speaker.png'}
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
const shippingFee = 0;

function displayAvailableItems() {
    const availableItemsContainer = document.getElementById("available-items");
    availableItemsContainer.innerHTML = '';

    availableItems.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("available-item");

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="available-item-image" />
            <p><strong>${item.name}</strong><br> ₱${item.price.toFixed(2)}</p>
            <button class="add" onclick="addToCartFromDisplay('${item.name}', ${item.price})">Add to Cart</button>
        `;

        availableItemsContainer.appendChild(itemDiv);
    });
}

function filterItemsByPrice() {
    const priceRange = document.getElementById("price-range").value;
    const filteredItems = availableItems.filter(item => {
        if (priceRange === "low") return item.price <= 5000;
        if (priceRange === "medium") return item.price > 5000 && item.price <= 20000;
        if (priceRange === "high") return item.price > 20000;
        return true;
    });
    displayFilteredItems(filteredItems);
}

function sortItems() {
    const sortOption = document.getElementById("sort").value;
    let sortedItems = [...availableItems];
    if (sortOption === "price-low-high") {
        sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
        sortedItems.sort((a, b) => b.price - a.price);
    }
    displayFilteredItems(sortedItems);
}

function displayFilteredItems(items) {
    const availableItemsContainer = document.getElementById("available-items");
    availableItemsContainer.innerHTML = '';
    items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("available-item");

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="available-item-image" />
            <p><strong>${item.name}</strong><br> - ₱${item.price.toFixed(2)}</p>
            <button class="add" onclick="addToCartFromDisplay('${item.name}', ${item.price})">Add to Cart</button>
        `;

        availableItemsContainer.appendChild(itemDiv);
    });
}

function addToCartFromDisplay(name, price) {
    const quantity = 1;
    
    const selectedItem = {
        name: name,
        price: price,
        quantity: quantity,
        image: availableItems.find(item => item.name === name)?.image || ' '
    };

    const existingItemIndex = cart.findIndex(item => item.name === selectedItem.name);

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += selectedItem.quantity;
    } else {
        cart.push(selectedItem);
    }

    totalPrice += selectedItem.price * selectedItem.quantity; 
    localStorage.setItem('cart', JSON.stringify(cart));

    displayCart(); 
    updateTotal();
}

if (window.location.pathname.includes('index.html')) { 
    displayAvailableItems();
}


function addToCart() {
    const itemName = document.getElementById("item-name").value;
    const itemPrice = parseFloat(document.getElementById("item-price").value);
    const itemQuantity = parseInt(document.getElementById("item-quantity").value);

    if (!itemName || isNaN(itemPrice) || isNaN(itemQuantity) || itemQuantity <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    let selectedItem = availableItems.find(item => item.name === itemName);

    if (!selectedItem) {
        selectedItem = {
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity
        };
        availableItems.push(selectedItem); 
    } else {
        selectedItem.quantity = itemQuantity;
    }

    const cartItem = cart.find(item => item.name === selectedItem.name);
    
    if (cartItem) {
        cartItem.quantity += itemQuantity;
    } else {
        cart.push({
            ...selectedItem,
            image: ' ' 
        });
    }

    totalPrice += selectedItem.price * itemQuantity; 
    localStorage.setItem('cart', JSON.stringify(cart));

    document.getElementById("item-name").value = '';
    document.getElementById("item-price").value = '';
    document.getElementById("item-quantity").value = '1';

    displayCart();
}

function displayCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image || 'images/default.jpg'}" alt="${item.name}" class="cart-item-image" />
                <p><strong>${item.name}</strong> (${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}</p>
                <button class="edit" onclick="editCartItem(${index})">Edit</button>
                <button class="remove" onclick="removeFromCart(${index})">Remove</button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        updateTotal();
    }
}

function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedTownFee = parseFloat(document.getElementById("towns").value);
    const finalTotal = subtotal + selectedTownFee;

    document.getElementById("subtotal-price").textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById("shipping-fee").textContent = `₱${selectedTownFee.toFixed(2)}`;
    document.getElementById("total-price").textContent = `₱${finalTotal.toFixed(2)}`;
}

function editCartItem(index) {
    const newQuantity = prompt("Enter new quantity:");
    if (newQuantity && !isNaN(newQuantity) && parseInt(newQuantity) > 0) {
        const item = cart[index];
        totalPrice -= item.price * item.quantity;
        item.quantity = parseInt(newQuantity); 
        totalPrice += item.price * item.quantity; 
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    } else {
        alert("Invalid quantity.");
    }
}

function removeFromCart(index) {
    const removedItem = cart.splice(index, 1)[0];
    totalPrice -= removedItem.price * removedItem.quantity;

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function checkout() {
    const selectedTownFee = parseFloat(document.getElementById("towns").value);
    const finalTotal = totalPrice + selectedTownFee;

    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to your cart before checking out.");
        return; 
    }

    let itemDetails = "You have purchased the following items:\n";
    cart.forEach(item => {
        itemDetails += `${item.name} - Quantity: ${item.quantity} - Amount: ₱${(item.price * item.quantity).toFixed(2)}\n`;
    });

    alert(itemDetails + "\nShipping Fee: ₱" + selectedTownFee.toFixed(2) +
          "\nFinal Total: ₱" + finalTotal.toFixed(2));

    alert("Purchase Successful! Thank you.");

    localStorage.removeItem('cart');
    cart = [];
    totalPrice = 0;

    document.getElementById("subtotal-price").textContent = "₱0.00";
    document.getElementById("shipping-fee").textContent = "₱0.00";
    document.getElementById("total-price").textContent = "₱0.00";
    
    displayCart();
}