if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    var removeCartButtons = document.getElementsByClassName("Cart-remove");
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName("class_quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    var addCartButtons = document.getElementsByClassName("add_cart");
    for (var i = 0; i < addCartButtons.length; i++) {
        var button = addCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }

    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    renderCartItems(cartItems);
    updateTotal();
    updateCartIcon();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    var cartBox = buttonClicked.closest('.cart_box');
    var id = cartBox.dataset.id;

    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems = cartItems.filter(item => item.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    cartBox.remove();
    updateTotal();
    updateCartIcon();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }

    var cartBox = input.closest('.cart_box');
    var id = cartBox.dataset.id;
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
            cartItems[i].quantity = parseInt(input.value, 10); // Ensure it's an integer
            break;
        }
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // Update all quantity inputs
    cartBox.querySelectorAll(".class_quantity").forEach(input => {
        input.value = cartItems.find(item => item.id === id).quantity;
    });

    updateTotal();
    updateCartIcon();
}


function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.closest('.card');
    var id = shopProducts.dataset.id;
    var title = shopProducts.getElementsByClassName("product_title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product_img")[0].src;

    addProductToCart(id, title, price, productImg);
    updateTotal();
}

function addProductToCart(id, title, price, productImg) {
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === id) {
            alert("You have already added this item to the cart");
            return;
        }
    }

    var cartItem = {
        id: id,
        title: title,
        price: price,
        productImg: productImg,
        quantity: 1
    };

    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    renderCartItems(cartItems);
    updateCartIcon();
}

function renderCartItems(cartItems) {
    var cartItemsContainer = document.getElementsByClassName("cart_content")[0];
    if (!cartItemsContainer) {
        console.error("Cart items container not found");
        return;
    }
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(cartItem => {
        var cartShopBox = document.createElement("div");
        cartShopBox.classList.add("cart_box");
        cartShopBox.dataset.id = cartItem.id;
        var cartBoxContent = `                                
            <div class="cart_box_sub">
                <img src="${cartItem.productImg}" alt="" class="cart_img" onerror="this.src='default-image-url.png';">
                <div class="cart_box_subsize">
                    <div class="cart_product_title">${cartItem.title}</div>
                    <div class="cart_box_subsize_sub">
                        <input type="number" value="${cartItem.quantity}" class="class_quantity mobile_quantity" />
                        <div class="cart_price mobile_price">${cartItem.price}</div>
                    </div>
                </div>
            </div>
            <div class="details_box">
                <input type="number" value="${cartItem.quantity}" class="class_quantity desktop_quantity" />
                <div class="cart_price desktop_price">${cartItem.price}</div>
            </div>
            <i class='bx bx-trash Cart-remove'></i>`;
        cartShopBox.innerHTML = cartBoxContent;
        cartItemsContainer.append(cartShopBox);

        cartShopBox.getElementsByClassName("Cart-remove")[0].addEventListener('click', removeCartItem);
        cartShopBox.querySelectorAll(".class_quantity").forEach(input => {
            input.addEventListener('change', quantityChanged);
        });
    });
}


function updateTotal() {
    var cartBoxes = document.getElementsByClassName("cart_box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart_price")[0];
        var quantityElement = cartBox.getElementsByClassName("class_quantity")[0];

        // Debugging statements
        console.log("Cart Box:", i + 1);;
        console.log("Price Element HTML:", priceElement.innerHTML);
        console.log("Quantity Element Value:", quantityElement.value);

        // Clean price data
        var priceText = priceElement.innerHTML.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
        var price = parseFloat(priceText);
        var quantity = parseInt(quantityElement.value, 10);

        console.log("Cleaned Price:", price);
        console.log("Quantity:", quantity);

        total += price * quantity;
    }

    total = Math.round(total * 100) / 100;

    console.log("Total Price:", total);

    if (document.getElementsByClassName("total_price")[0]) {
        document.getElementsByClassName("total_price")[0].innerHTML = "$" + total;
    }
    if (document.getElementsByClassName("total_price_two")[0]) {
        document.getElementsByClassName("total_price_two")[0].innerHTML = "$" + total;
    }
}

function updateCartIcon() {
    var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    var totalQuantity = cartItems.reduce((acc, item) => acc + parseInt(item.quantity, 10), 0); // Ensure it's an integer

    var cartIcon = document.querySelector("#Cart_icon");
    if (cartIcon) {
        cartIcon.setAttribute("data-quantity", totalQuantity);
    } else {
        console.error("Cart icon element not found");
    }
}


// Function to clear cart items from local storage (for testing purposes)
function clearCart() {
    localStorage.removeItem("cartItems");
    document.getElementsByClassName("cart_content")[0].innerHTML = ''; // Clear existing items from the DOM
    updateTotal();
    updateCartIcon();
}
