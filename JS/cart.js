// =======================
// CART.JS - Add to Cart
// =======================

// 1. Select all Add to Cart buttons (for index.html)
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.chair-card, .product-card, .mirror-card');

        const name = card.querySelector('.product-name, h6').innerText;
        const price = parseInt(card.querySelector('.price').dataset.price);
        const image = card.querySelector('img').src;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ name, price, image });
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        const cartCount = document.getElementById('cart-count');
        if (cartCount) cartCount.innerText = cart.length;

        // Daraz style modal (optional)
        const modalTitle = document.querySelector('#confirmCartModal .modal-title');
        const modalBody = document.querySelector('#confirmCartModal .modal-body');
        if (modalTitle && modalBody) {
            modalTitle.innerText = "Add Item to Cart";
            modalBody.innerText = "This product will be added to your shopping cart.";
        }
    });
});

// =======================
// DISPLAY CART ITEMS ON CART.HTML
// =======================
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update cart count in header
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.length;

    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = ''; // Clear container

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <input type="checkbox" class="item-select" checked>
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h6>${item.name}</h6>
                <p class="price">Rs. ${item.price}</p>
            </div>
            <div class="cart-actions">
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    // Function to update order summary based on selected items
    function updateSummary() {
        const checkboxes = document.querySelectorAll('.item-select');
        let subtotal = 0;
        checkboxes.forEach((checkbox, i) => {
            if (checkbox.checked) {
                subtotal += cart[i].price;
            }
        });
        const shipping = subtotal > 0 ? 300 : 0;
        document.getElementById('subtotal').innerText = `Rs. ${subtotal}`;
        document.getElementById('shipping').innerText = `Rs. ${shipping}`;
        document.getElementById('total').innerText = `Rs. ${subtotal + shipping}`;
    }

    updateSummary(); // initial summary

    // Listen to checkbox changes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('item-select')) {
            updateSummary();
        }
    });

    // Remove button functionality
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.item-select');
            const selectedItems = [];

            checkboxes.forEach((checkbox, i) => {
                if (checkbox.checked) selectedItems.push(cart[i]);
            });

            if (selectedItems.length === 0) {
                alert('Please select at least one item to checkout.');
                return;
            }

            alert(`Checkout successful for ${selectedItems.length} item(s)!`);
            // Remove selected items from cart
            cart = cart.filter((item, i) => !checkboxes[i].checked);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
    }
});
