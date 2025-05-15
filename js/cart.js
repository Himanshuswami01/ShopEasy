document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartSummary();
    setupEventListeners();
});

function setupEventListeners() {
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-button');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async function() {
            try {
                // Save cart data to localStorage before navigating
                const cartData = cart.items.reduce((acc, item) => {
                    acc[item.id] = {
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image
                    };
                    return acc;
                }, {});
                localStorage.setItem('cartData', JSON.stringify(cartData));
                
                // Navigate to checkout page
            window.location.href = 'checkout.html';
            } catch (error) {
                console.error('Error during checkout:', error);
                showNotification('Error during checkout. Please try again.', 'error');
            }
        });
    }

    // Continue shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

function loadCartItems() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Get product details (in a real app, this would come from a database)
    const products = {
        1: {
            id: 1,
            name: "Wireless Headphones",
            price: 99.99,
            image: "../images/products/headphones.jpg"
        },
        2: {
            id: 2,
            name: "Smartphone",
            price: 599.99,
            image: "../images/products/smartphone.jpg"
        }
    };
    
    // Count occurrences of each product
    const productCounts = cart.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});
    
    if (Object.keys(productCounts).length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="../index.html" class="continue-shopping">Continue Shopping</a></div>';
        return;
    }
    
    // Create cart items HTML
    cartItems.innerHTML = Object.entries(productCounts).map(([id, quantity]) => {
        const product = products[id];
        return `
            <div class="cart-item" data-id="${id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <div class="item-price">$${product.price}</div>
                    <div class="item-quantity">
                        <button class="quantity-button" onclick="updateQuantity(${id}, -1)">-</button>
                        <span>${quantity}</span>
                        <button class="quantity-button" onclick="updateQuantity(${id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-button" onclick="removeItem(${id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (change > 0) {
        cart.push(productId);
    } else {
        const index = cart.indexOf(productId);
        if (index > -1) {
            cart.splice(index, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    showNotification(change > 0 ? 'Quantity increased' : 'Quantity decreased');
}

function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartSummary();
    updateCartCount();
    showNotification('Item removed from cart');
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = {
        1: { price: 99.99 },
        2: { price: 599.99 }
    };
    
    const itemsTotal = cart.reduce((sum, id) => sum + products[id].price, 0);
    const shipping = itemsTotal > 0 ? 5.99 : 0;
    const total = itemsTotal + shipping;
    
    const itemsTotalEl = document.getElementById('items-total');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    
    if (itemsTotalEl) itemsTotalEl.textContent = `$${itemsTotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Cart class to handle all cart operations
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.setupEventListeners();
        this.updateCartCount();
        this.renderCart();
    }

    loadCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                try {
                    const productCard = e.target.closest('.product-card');
                    if (!productCard) return;

                    const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
                    const productName = productCard.querySelector('h3')?.textContent;
                    const priceText = productCard.querySelector('.price')?.textContent;
                    const productImage = productCard.querySelector('img')?.src;

                    if (!productName || !priceText || !productImage) {
                        throw new Error('Missing product information');
                    }

                    const productPrice = parseFloat(priceText.replace('₹', '').replace(',', ''));
                    
                    this.addItem({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });

                    // Show success notification
                    this.showNotification(`${productName} added to cart`);
                } catch (error) {
                    console.error('Error adding item to cart:', error);
                    this.showNotification('Error adding item to cart', 'error');
                }
            });
        });

        // Buy now buttons
        document.querySelectorAll('.buy-now-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                try {
                    const productCard = e.target.closest('.product-card');
                    if (!productCard) return;

                    const productId = productCard.dataset.productId;
                    const productName = productCard.querySelector('h3')?.textContent;
                    const priceText = productCard.querySelector('.price')?.textContent;
                    const productImage = productCard.querySelector('img')?.src;

                    if (!productId || !productName || !priceText || !productImage) {
                        throw new Error('Missing product information');
                    }

                    const productPrice = parseFloat(priceText.replace('₹', '').replace(',', ''));
                    
                    this.addItem({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });

                    window.location.href = 'checkout.html';
                } catch (error) {
                    console.error('Error processing buy now:', error);
                    this.showNotification('Error processing buy now', 'error');
                }
            });
        });
    }

    addItem(item) {
        try {
            const existingItem = this.items.find(i => i.id === item.id);
            
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                this.items.push(item);
            }

            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        } catch (error) {
            console.error('Error adding item:', error);
            this.showNotification('Error adding item to cart', 'error');
        }
    }

    removeItem(productId) {
        try {
            this.items = this.items.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
            this.showNotification('Item removed from cart');
        } catch (error) {
            console.error('Error removing item:', error);
            this.showNotification('Error removing item from cart', 'error');
        }
    }

    updateQuantity(productId, change) {
        try {
            const item = this.items.find(i => i.id === productId);
            if (item) {
                item.quantity = Math.max(0, item.quantity + change);
                if (item.quantity === 0) {
                    this.removeItem(productId);
                } else {
                    this.saveCart();
                    this.updateCartCount();
                    this.renderCart();
                }
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            this.showNotification('Error updating quantity', 'error');
        }
    }

    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart:', error);
            this.showNotification('Error saving cart', 'error');
        }
    }

    updateCartCount() {
        try {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    renderCart() {
        try {
            const cartItems = document.querySelector('.cart-items');
            if (!cartItems) return;

            if (this.items.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="../index.html" class="continue-shopping">Continue Shopping</a></div>';
                return;
            }

            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="item-price">₹${item.price.toFixed(2)}</div>
                        <div class="item-quantity">
                            <button class="quantity-button" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-button" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-button" onclick="cart.removeItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');

            this.updateCartSummary();
        } catch (error) {
            console.error('Error rendering cart:', error);
            this.showNotification('Error displaying cart', 'error');
        }
    }

    updateCartSummary() {
        try {
            const itemsTotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = itemsTotal > 0 ? 99 : 0;
            const total = itemsTotal + shipping;

            const itemsTotalEl = document.getElementById('items-total');
            const shippingEl = document.getElementById('shipping');
            const totalEl = document.getElementById('total');

            if (itemsTotalEl) itemsTotalEl.textContent = `₹${itemsTotal.toFixed(2)}`;
            if (shippingEl) shippingEl.textContent = `₹${shipping.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
        } catch (error) {
            console.error('Error updating cart summary:', error);
        }
    }

    showNotification(message, type = 'success') {
        try {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <p>${message}</p>
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    getCartTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }
}

// Initialize cart
const cart = new Cart();

// Export cart instance for use in other files
window.cart = cart; 